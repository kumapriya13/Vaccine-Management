import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { RecipientAuthService, RecipientService, UserService } from 'src/app/core';
import { BulkUpload } from 'src/app/core/services/bulkupload.service';
import {
  ComponentUserStaticQuestionnaireComponent,
} from 'src/app/shared/components/component-user-static-questionnaire/component-user-static-questionnaire.component';
import { applicableList, COUNTIES, raceList,GENDER_TYPES } from 'src/app/shared/helpers/constant';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { FAMILY_RELATION_TYPES } from '../../../../shared/helpers/constant';

@UntilDestroy()
@Component({
  selector: 'app-recipient-editor',
  templateUrl: './recipient-editor.component.html',
  styleUrls: ['./recipient-editor.component.scss'],
  providers: [
  ],
})
export class RecipientEditorComponent implements OnInit {
  @ViewChild(ComponentUserStaticQuestionnaireComponent)
  questionnaireComponent: ComponentUserStaticQuestionnaireComponent;

  dialCode: string = '+1';
  iso2: string = '';

  formGroup: FormGroup;
  raceList: any[] = raceList;
  applicableList: any[] = applicableList;
  public show: boolean = false;
  public stateshow: boolean = true;

  stateInfo: any[] = [];
  countryInfo: any[] = [];

  maxDate: Date;
  isNew: boolean = true;

  countyAd = COUNTIES;
  FAMILY_RELATIONS = FAMILY_RELATION_TYPES;

  objectId: string;
  object: any = {};
  genderData  = GENDER_TYPES;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private recipientAuthService: RecipientAuthService,
    private bulkUploadService: BulkUpload,
    private userService: UserService,
    private notificationService: NotificationService,
    private country: CountriesService,
    private recipientService: RecipientService,
    public dialog: MatDialog,
  ) {
    this.route.params.subscribe((params) => {
      this.objectId = params.id;
      this.isNew = !this.objectId;
    });
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const currentDate = currentDateObj.getDate();

    this.maxDate = new Date(currentYear - 12, currentMonth, currentDate);
  }

  ngOnInit(): void {
    if (this.isNew) {
      this.buildForm();
      this.userService.getUserById().subscribe((data) => {
        this.formGroup.patchValue({
          address1: data.address1,
          address2: data.address2,
          address3: data.address3,
          city: data.city,
          zip: data.zip,
          state: data.state,
          country: data.country,
          county: data.county,
        });
      });
    } else {
      this.loadObject().subscribe(() => this.buildForm(this.object));
    }

    this.getCountries();
  }

  buildForm(data: any = {}) {
    this.formGroup = this.formBuilder.group({
      firstName: [data.fname, Validators.required],
      lastName: [data.lname, Validators.required],
      dob: [data.dob ? new Date(data.dob?.replace(/-/g, '\/')) : null, Validators.required],
      phone: [data.mobile_number, [Validators.pattern("^[0-9]*$")]],
      email: [data.email, [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      address1: [data.address1, Validators.required],
      address2: [data.address2],
      address3: [data.address3],
      city: [data.city, Validators.required],
      zip: [data.zip, [Validators.required, Validators.pattern('^[0-9]*$')]],
      termandCondition: [false],
      state: [data.state, Validators.required],
      gender: [data.gender, Validators.required],
      country: [data.country, Validators.required],
      county: [data.county, Validators.required],
      primary_relationship: [data.primary_relationship, Validators.required],
      countryFlag: ('countryFlag' in data && data.countryFlag.hasOwnProperty('iso2')) ? data.countryFlag: '',
    });

    if(data.mobile_number==null){
      this.formGroup.controls.phone.setValue('');
      this.iso2 = 'us';
    } else {
      // for old records
      let iso2: number = this.iso2.toString().trim().length;
      let mob: number = data.mobile_number.toString().trim().length;
      if (mob !== 0) {
        if(data.mobile_number.indexOf('+1') > -1){
          this.iso2 = 'us';
          this.formGroup.controls.phone.setValue(data.mobile_number.replace("+1",""))
          console.log("event us");
        }
        else if(data.mobile_number.indexOf('+91') > -1){
          this.iso2 = 'in';
          this.formGroup.controls.phone.setValue(data.mobile_number.replace("+91",""))
          console.log("event in");
        } else {
          this.iso2 = 'us';
        }
      } else {
        this.iso2 = 'us';
      }
    }
    this.watchZipChange(this.formGroup);
  }



  onLoadCountryChange(event) {
    setTimeout(() => {
    //alert(this.iso2)
    //console.log("event load 1",event);
    event.setCountry(this.iso2)
    let data = event.hasOwnProperty('s') ? event.s : event;
      console.log('event load',data,this.iso2)
      this.formGroup.controls.countryFlag.patchValue(data)
      this.dialCode = data;
    }, 1000);
  }

  onCountryChange(event) { 
    let data = event.hasOwnProperty('s') ? event.s : event;
    console.log('event change',data)
      this.formGroup.controls.countryFlag.patchValue(data);
      this.iso2 = data.iso2; 
  }

  filterCountryFlag(data: any){
    let object  = {name: "United States", iso2: "us", dialCode: "1"}
     if(data){
       object.name = data.hasOwnProperty('name') ? data.name : object.name;
       object.iso2 = data.hasOwnProperty('iso2') ? data.iso2 : object.iso2;
       object.dialCode = data.hasOwnProperty('dialCode') ? data.dialCode : object.dialCode;
     }
     return object;
     }

  save() {
    if (!this.formGroup.valid) {
      return;
    }

    const questionValidation =this.questionnaireComponent.getAnswers();

    if(questionValidation[0].validation || questionValidation[1].validation){
      return
    }
    let formData = this.formGroup.value;
    if (!formData.termandCondition) {
      alert('Please accept Terms of Service and Privacy Policy');
      return;
    }

    let reqData: any = {
      id: this.objectId,
      fname: formData.firstName,
      lname: formData.lastName,
      address1: formData.address1,
      address2: formData.address2,
      address3: formData.address3,
      home_adress: formData.address1 + formData.address2 + formData.address3,
      zip: formData.zip,
      dob: moment(formData.dob).format('YYYY-MM-DD'),
      mobile_number: formData.phone,
      email: this.isNew ? formData.email : undefined,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      county: formData.county,
      primary_relationship: formData.primary_relationship,
      static_questionnaire_answers: this.questionnaireComponent.getAnswers(),
      countryFlag: this.filterCountryFlag(formData.countryFlag)
    };

    const call = this.isNew
      ? this.recipientService.registerDependentUser([reqData])
      : this.bulkUploadService.RecipientEdit(reqData);

    call.subscribe((res) => {
      this.router.navigate(['recipient', 'family']);
    });
  }

  checkUserByEmailID(emailControl: FormControl): Observable<any> {
    const emailId = emailControl.value;

    return this.recipientAuthService.userCheck(emailId).pipe(
      map((existingRecipient) => {
        if (existingRecipient) {
          return {
            existingRecipient: true,
          };
        } else {
          return null;
        }
      }),
    );
  }

  getCountries() {
    this.country.allCountries().subscribe(
      (data2) => {
        this.countryInfo = data2.Countries;
        this.stateInfo = this.countryInfo['230'].States;
      },
      (err) => console.log(err),
      () => console.log('complete'),
    );
  }

  onChangeCountry(countryValues) {
    let countryName = countryValues.value;
    const countryInfo = _.find(this.countryInfo, { CountryName: countryName });
    if (countryInfo) {
      this.stateInfo = countryInfo.States;
    }
  }

  getage(dateString) {
    let today = new Date();
    var birthDate = new Date(dateString.value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (m < 0) {
      m += 12;
    }
    if (age < 12) {
      return this.notificationService.showNotification('Age should be greater than 12', 'top', 'error');
    }
  }

  private next(): void {
    this.router.navigate(['../../next'], { relativeTo: this.route });
  }

  private goToList(): void {
    this.router.navigate([this.isNew ? '../../recipients' : '../../../recipients'], { relativeTo: this.route });
  }

  private loadObject(): Observable<any> {
    return this.bulkUploadService
      .getRecipientDataUser({
        searchdata: `id=${this.objectId}`,
      })
      .pipe(
        map((response) => {
          this.object = response.results[0];
          return this.object;
        }),
      );
  }

  private watchZipChange(formGroup: FormGroup): void {
    formGroup.controls.zip.valueChanges
      .pipe(
        debounceTime(300),
        // filter((value) => value?.length > 4 && value?.length < 11),
        untilDestroyed(this),
      )
      .subscribe((zip) => {
        if(zip.length > 4){
        this.recipientAuthService.fetchdetails({ zip }).subscribe(({ city, latitude, longitude, state,country,county }) => {
          this.show = true;
          this.stateshow = false;
          formGroup.patchValue({
            city,
            country,
            county,
            state: this.country.abbrState(state),
          });
        });
      }else{
        this.show = false;
        this.stateshow = true;
        formGroup.patchValue({
          city:'',
          county:'',
          state: '',
        });



      }
      });
  }
}
