import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { RecipientAuthService, UserService } from '../../../core';
import { applicableList, raceList, COUNTYAD } from '../../../shared/helpers/constant';

@Component({
  selector: 'app-page-edit-profile',
  templateUrl: './page-edit-profile.component.html',
  styleUrls: ['./page-edit-profile.component.scss'],
  providers: [
    // { provide: DateAdapter, useClass: AppDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class PageEditProfileComponent implements OnInit {

  dialCode: string = '+1';
  iso2: string = '';

  passwordToggler: boolean;
  returnUrl: string;
  authRecipientEditForm: FormGroup;
  raceList: any[] = raceList;
  stateInfo: any[] = [];
  countryInfo: any;
  cityInfo: any[] = [];
  applicableList: any[] = applicableList;
  userDetails: any = {};
  public show: boolean = false;
  public stateshow: boolean = true;
  private _NotificationService: NotificationService
  maxDate: Date;
  recipientId: string;

  countyAd = COUNTYAD;
  temp: any;
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private country: CountriesService,
    private route: ActivatedRoute,
  ) {
    this.recipientId = this.route.snapshot.params?.id;
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const currentDate = currentDateObj.getDate();

    this.maxDate = new Date(currentYear - 12, currentMonth, currentDate);

  }

  ngOnInit(): void {
    this.buildForm();
    this.getCountries();
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  
  onLoadCountryChange(event) {
    setTimeout(() => {
    event.setCountry(this.iso2)
    let data = event.hasOwnProperty('s') ? event.s : event;
      console.log('event load',data,this.iso2)
      this.authRecipientEditForm.controls.countryFlag.patchValue(data)
      this.dialCode = data;
    }, 1000);
  }

  onCountryChange(event) { 
    let data = event.hasOwnProperty('s') ? event.s : event;
    console.log('event change',data)
      this.authRecipientEditForm.controls.countryFlag.patchValue(data);
      this.iso2 = data.iso2; 
  }

  getage() {
    let today = new Date();
    var birthDate = this.authRecipientEditForm.value.dob;

    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (m < 0) {
      m += 12;
    }
    if (age < 12) {
      return this._NotificationService.showNotification(
        'Age should be greater than 16',
        'top',
        'error'
      );
    }
  }

  buildForm() {
    this.userService.getUserById(this.recipientId).subscribe((currentRecipientProfile) => {
      this.userDetails = currentRecipientProfile;

      this.authRecipientEditForm = this._formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        phoneNumber: ['',Validators.pattern("^[0-9]*$")],
        countryFlag: [''],
        dob: ['', [Validators.required]],
        address1: ['', [Validators.required]],
        address2: [''],
        address3: [''],
        homePhoneNumber: [''],
        city: ['', [Validators.required]],
        zip: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        county: ['', [Validators.required]],
        insurance: [],
        insuranceprovidername: [],
        medicalGroupNumber: [],
        memberId: [],
      });

      const answers = currentRecipientProfile.static_questionnaire_answers;
      if (answers && answers.length > 0) {
        var Insurance = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Insurance' : [])
        var insuranceprovidername = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Insurance Provider Name' : []);
        var medicalGroupNumber = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Medical Group Number' : []);
        var memberId = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Medical ID' : []);
      }
      if(currentRecipientProfile.zip){
        this.show = true;
        this.stateshow = false;
      }
      if(currentRecipientProfile.state){
        this.onChangeState({value:currentRecipientProfile.state})
      }

      if(currentRecipientProfile.mobile_number==null){
        currentRecipientProfile.mobile_number='';
        this.iso2 = 'us';
      } else {
        // for old records
        let iso2: number = this.iso2.toString().trim().length;
        let mob: number = currentRecipientProfile.mobile_number.toString().trim().length;
        if (mob !== 0) {
          if(currentRecipientProfile.mobile_number.indexOf('+1') > -1){
            this.iso2 = 'us';
            currentRecipientProfile.mobile_number = currentRecipientProfile.mobile_number.replace("+1","")
            console.log("event us");
          }
          else if(currentRecipientProfile.mobile_number.indexOf('+91') > -1){
            this.iso2 = 'in';
            currentRecipientProfile.mobile_number = currentRecipientProfile.mobile_number.replace("+91","")
            console.log("event in");
          } else {
            this.iso2 = 'us';
          }
        } else {
          this.iso2 = 'us';
        }
      }


      this.authRecipientEditForm.patchValue({
        firstName: currentRecipientProfile.fname ? currentRecipientProfile.fname : '',
        lastName: currentRecipientProfile.lname ? currentRecipientProfile.lname : '',
        email: currentRecipientProfile.email ? currentRecipientProfile.email : '',
        phoneNumber: currentRecipientProfile.mobile_number,
        dob: currentRecipientProfile.dob ? new Date(currentRecipientProfile.dob?.replace(/-/g, '\/')) : '',
        address1: currentRecipientProfile.address1 ? currentRecipientProfile.address1 : '',
        address2: currentRecipientProfile.address2 ? currentRecipientProfile.address2 : '',
        address3: currentRecipientProfile.address3 ? currentRecipientProfile.address3 : '',
        homePhoneNumber: currentRecipientProfile.home_number ? currentRecipientProfile.home_number : '',
        zip: currentRecipientProfile.zip ? currentRecipientProfile.zip : '',
        city: currentRecipientProfile.city ? currentRecipientProfile.city : '',
        state: currentRecipientProfile.state ? currentRecipientProfile.state : '',
        country: currentRecipientProfile.country ? currentRecipientProfile.country : 'US',
        county: currentRecipientProfile.county ? currentRecipientProfile.county : '',
        insurance: (Insurance && Insurance.length > 0) ? Insurance[0].answers[0] : '',
        insuranceprovidername: (insuranceprovidername && insuranceprovidername.length > 0) ? insuranceprovidername[0].answers[0] : '',
        medicalGroupNumber: (medicalGroupNumber && medicalGroupNumber.length > 0) ? medicalGroupNumber[0].answers[0] : '',
        memberId: (memberId && memberId.length > 0) ? memberId[0].answers[0] : '',
        countryFlag: ('countryFlag' in currentRecipientProfile && currentRecipientProfile.countryFlag.hasOwnProperty('iso2')) ? currentRecipientProfile.countryFlag: '',
      });
    });
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

  authRecipientEditFormSub() {
    if (!this.authRecipientEditForm.valid) {
      return;
    }

    let formData = this.authRecipientEditForm.value;
    const currentRecipientProfile = this.userDetails;
    currentRecipientProfile.fname = formData.firstName;
    currentRecipientProfile.lname = formData.lastName;
    currentRecipientProfile.email = formData.email;
    currentRecipientProfile.mobile_number = formData.phoneNumber;
    currentRecipientProfile.dob = moment(formData.dob).format('YYYY-MM-DD');
    currentRecipientProfile.address1 = formData.address1;
    currentRecipientProfile.address2 = formData.address2;
    currentRecipientProfile.address3 = formData.address3;
    currentRecipientProfile.home_number = formData.homePhoneNumber;
    currentRecipientProfile.zip = formData.zip;
    currentRecipientProfile.city = formData.city;
    currentRecipientProfile.state = formData.state;
    currentRecipientProfile.country = formData.country;
    currentRecipientProfile.county = formData.county;
    currentRecipientProfile.countryFlag = this.filterCountryFlag(formData.countryFlag);
    if (currentRecipientProfile.primary_relationship) {
      currentRecipientProfile.recipient_id = currentRecipientProfile.id;
      delete currentRecipientProfile.id;
    }

    const answers: any[] = currentRecipientProfile.static_questionnaire_answers || [];
    if (answers.length > 0) {
      var Insurance = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Insurance' : []);
      var insuranceprovidername = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Insurance Provider Name' : []);
      var medicalGroupNumber = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Medical Group Number' : []);
      var memberId = answers.filter((x) => x.question_text ? x.question_text.toString().trim() == 'Medical ID' : []);
    }

    /**
     * Updating Insurance answers
     */
    if (Insurance && Insurance.length > 0) Insurance[0].answers[0] = Insurance ? formData.insurance : '';
    if (insuranceprovidername && insuranceprovidername.length > 0)
      insuranceprovidername[0].answers[0] = insuranceprovidername ? formData.insuranceprovidername : '';
    if (medicalGroupNumber && medicalGroupNumber.length > 0) medicalGroupNumber[0].answers[0] = medicalGroupNumber ? formData.medicalGroupNumber : '';
    if (memberId && memberId.length > 0) memberId[0].answers[0] = memberId ? formData.memberId : '';

    /**
     * Updating questing if not there
     */

    if (!Insurance) {
      const Insurance = {
        questioneer_id: '1',
        question_text: 'Insurance',
        answers: [formData.insurance],
      };
      answers.push(Insurance);
    }
    if (!insuranceprovidername) {
      const providerName = {
        questioneer_id: '2',
        question_text: 'Insurance Provider Name',
        answers: [formData.insuranceprovidername],
      };
      answers.push(providerName);
    }
    if (!medicalGroupNumber) {
      const mGroupName = {
        questioneer_id: '3',
        question_text: 'Medical Group Number',
        answers: [formData.medicalGroupNumber],
      };
      answers.push(mGroupName);
    }
    if (!memberId) {
      const mId = {
        questioneer_id: '4',
        question_text: 'Medical ID',
        answers: [formData.memberId],
      };
      answers.push(mId);
    }
    this.userService.saveRecipientProfile(currentRecipientProfile).subscribe(
      (res) => {
        this._router.navigate(this.recipientId ? ['recipient/family'] : ['/recipient/profile']);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  onCancel(): void {
    this._router.navigate(this.recipientId ? ['recipient/family'] : ['/recipient/profile']);
  }

  checkUserByEmailID(emailControl: FormControl): Observable<any> {
    const emailId = emailControl.value;
    return this._providerRecipientAuthService.userCheck(emailId).pipe(
      map((existingRecipient) => {
        if (existingRecipient) {
          return { existingRecipient: true };
        } else {
          return null;
        }
      }),
    );
  }

  onRaceCheckboxChange(value: string, isChecked: boolean) {
    const raceFormArray = <FormArray>(<FormGroup>this.authRecipientEditForm.controls.answers).controls.raceFormArray;
    if (isChecked) {
      raceFormArray.push(new FormControl(value));
    } else {
      let index = raceFormArray.controls.findIndex((x) => x.value == value);
      raceFormArray.removeAt(index);
    }
  }

  getCountries() {
    this.country.allCountries().subscribe(
      (data2) => {
        // this.countryInfo = data2.Countries;
        this.countryInfo = 'US';
        var reqObj = {
          "loc": "country",
          "value": "US"
        }
        this._providerRecipientAuthService.allStateOnUs(reqObj).subscribe(
          (res) => {
            this.stateInfo = res.result.states;
          }

        )
      },
      (err) => console.log(err),
      () => console.log('complete')
    );
  }

  onChangeState(stateValues) {
    let stateValue = stateValues.value;
    var reqObjState = {
      "loc": "state",
      "value": stateValue
    }
    this._providerRecipientAuthService.allCountyState(reqObjState).subscribe(
      (res) => {
        this.countyAd = res.result.counties;
      }

    )
  }
  onSelectAllCheckboxChange(value: string, isChecked: boolean) {
    const applyAllFormArray = <FormArray>(
      (<FormGroup>this.authRecipientEditForm.controls.answers).controls.applyAllFormArray
    );

    if (isChecked) {
      applyAllFormArray.push(new FormControl(value));
    } else {
      let index = applyAllFormArray.controls.findIndex((x) => x.value == value);
      applyAllFormArray.removeAt(index);
    }
  }

  fetcheditzipdetails(zipvalue) {
    if (zipvalue.value.length > 4) {
      let zip = {
        zip: zipvalue.value,
      };
      this._providerRecipientAuthService.fetchdetails(zip).subscribe(
        (res) => {
          this.authRecipientEditForm.controls.city.setValue(res.city);
          this.authRecipientEditForm.controls.state.setValue(res.state);
          this.authRecipientEditForm.controls.country.setValue(res.country);
          this.authRecipientEditForm.controls.county.setValue(res.county);
          this.show = true;
          this.stateshow = false;
        },
        (err) => {
          this.getError()
          //this._NotificationService.showNotification("User already exist","top",'error')
          //alert(err)
        },
      );
    } else {
      this.getError()
    }
  }

  getError() {
    this.show = false;
    this.stateshow = true;
    this.authRecipientEditForm.controls.city.setValue('');
    this.authRecipientEditForm.controls.state.setValue('');
    this.authRecipientEditForm.controls.county.setValue('');
    this.countyAd = COUNTYAD;
  }
}
