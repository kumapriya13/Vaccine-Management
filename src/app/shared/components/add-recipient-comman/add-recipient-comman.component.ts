import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipientAuthService } from 'src/app/core/services/auth/recipient-auth.service';
//import { RecipientAuthService } from 'src/app/core';
import {
  applicableList,
  passwordContext,
  raceList, medicalList, GENDER_TYPES, GENDER_TYPES_FOR_ADD
} from 'src/app/shared/helpers/constant';
import { ModalPrivacyPolicyComponent } from 'src/app/shared/modals/modal-privacy-policy/modal-privacy-policy.component';
import { ModalTermsOfUseComponent } from 'src/app/shared/modals/modal-terms-of-use/modal-terms-of-use.component';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { BulkUpload, SiteAdminService } from '../../../core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminRecipientInviteFormComponent } from '../../../shared/components/admin-recipient-invite-form/recipient-invite-form.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-recipient-comman',
  templateUrl: './add-recipient-comman.component.html',
  styleUrls: ['./add-recipient-comman.component.scss']
})
export class AddRecipientCommanComponent implements OnInit {
  dialCode: string ='+1';
  iso2: string = 'us';
  passwordToggler: boolean;
  returnUrl: string;
  authRegistrationSignUpForm: FormGroup;
  raceList: any[] = raceList;
  applicableList: any[] = applicableList;
  medicalList: any[] = medicalList;
  public show: boolean = false;
  public stateshow: boolean = true;
  stateInfo: any[] = [];
  countryInfo: any;
  cityInfo: any[] = [];
  passwordContext = passwordContext;
  hide: boolean = true;
  objectId: string;
  object: any = {};
  isNew: boolean = true;
  maxDate: Date;
  genderData = GENDER_TYPES_FOR_ADD; //GENDER_TYPES;
  countyAd = [
    'Atlantic',
    'Bergen',
    'Burlington',
    'Camden',
    'Cumberland',
    'Essex',
    'Glouceste',
    'Hudson',
    'Hunterdon',
    'Mercer',
    'Middlesex',
    'Monmouth',
    'Morris',
    'Ocean',
    'Passaic',
    'Salem',
    'Somerset',
    'Sussex',
    'Union',
    'Warren',
  ];
  storeData: void;
  userInfodata: void;
  checkedValidation : boolean = false;
  constructor(
    private route: ActivatedRoute,
    private BulkUploadService: BulkUpload,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private _siteAdminService: SiteAdminService,
    private _NotificationService: NotificationService,
    private country: CountriesService,
    private modalService: NgbModal,
    private location: Location,
    public dialog: MatDialog
  ) {
      this.route.params.subscribe((params) => {
        this.objectId = params.id;
        this.isNew = !this.objectId;
      })
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const currentDate = currentDateObj.getDate();

    this.maxDate = new Date(currentYear - 12, currentMonth, currentDate);
  }

  ngOnInit(): void {
    this.authRegistrationSignUpForm = this._formBuilder.group({
      recaptcha: ['', Validators.required],
    });
    this.buildForm();
    this.passwordToggler = false;
    this.getCountries();
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  buildForm() {
    this.authRegistrationSignUpForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: ['',[Validators.required]],
      gender: [''],
      phone: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [
        '',
        [
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
        ],
      ],
      primaryType: [''],
      homeno: ['', [Validators.pattern("^[0-9]*$")]],
      address1: [''],
      address2: [''],
      address3: [''],
      city: [''],
      password: [''],
      confirmPassword: [''],
      zip: [''],
      termandCondition: [false, [Validators.required]],
      state: [''],
      country: ['United States', ''],
      county: [''],
      insurance: [''],
      insuranceprovidername: [''],
      medicalGroupNumber: [''],
      memberId: [''],
      answers: this._formBuilder.group({
        ethnicgroup: ['',[Validators.required]],
        raceFormArray: this._formBuilder.array([]),
        applyAllFormArray: this._formBuilder.array([]),
        medicalAllFormArray: this._formBuilder.array([]),
        prescriptionQ: [''],
        allergiestomedications: [''],
        otherillnesses: [''],
        chronicorlongstanding: [''],
      }),
    });
  }

  // Choose gender using select dropdown
  changeGender(e) {
    this.authRegistrationSignUpForm.get('gender').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  onCountryChange(event) {
    this.dialCode = '+' + event.dialCode;
    this.iso2 = event.iso2;
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
      })
    );
  }

  onRaceCheckboxChange(value: string, isChecked: boolean) {
    const raceFormArray = <FormArray>(
      (<FormGroup>this.authRegistrationSignUpForm.controls.answers).controls
        .raceFormArray
    );
    if (isChecked) {
      raceFormArray.push(new FormControl(value));
    } else {
      let index = raceFormArray.controls.findIndex((x) => x.value == value);
      raceFormArray.removeAt(index);
    }
    this.checkedValidation =  this.authRegistrationSignUpForm.value.answers.raceFormArray.length ? false : true

  }

  onSelectAllCheckboxChange(value: string, isChecked: boolean) {
    const applyAllFormArray = <FormArray>(
      (<FormGroup>this.authRegistrationSignUpForm.controls.answers).controls
        .applyAllFormArray
    );

    if (isChecked) {
      applyAllFormArray.push(new FormControl(value));
    } else {
      let index = applyAllFormArray.controls.findIndex((x) => x.value == value);
      applyAllFormArray.removeAt(index);
    }
    // checkedValidation
  }

  onSelectAllRadioChange(value: string, isChecked: boolean) {
    const medicalAllFormArray = <FormArray>(
      (<FormGroup>this.authRegistrationSignUpForm.controls.answers).controls
        .medicalAllFormArray
    );

    if (isChecked) {
      medicalAllFormArray.push(new FormControl(value));
    } else {
      let index = medicalAllFormArray.controls.findIndex(
        (x) => x.value == value
      );
      medicalAllFormArray.removeAt(index);
    }
  }

  getCountries() {
    this.country.allCountries().subscribe(
      (data2) => {
       // this.countryInfo = data2.Countries;
        this.countryInfo = 'US';
        this.authRegistrationSignUpForm.controls.country.setValue('US');
        var reqObj= {
          "loc":"country",
          "value":"US"
      }
        this._providerRecipientAuthService.allStateOnUs(reqObj).subscribe(
          (res)=>{
            this.stateInfo = res.result.states;
            console.log(this.stateInfo);
        }

        )
        //this.stateInfo = this.countryInfo['230'].States;
      },
      (err) => console.log(err),
      () => console.log('complete')
    );
  }

  onChangeCountry(countryValues) {
    let countryValue = countryValues.value;
    this.stateInfo = this.countryInfo[countryValue].States;
    this.cityInfo = this.stateInfo[0].Cities;
  }

  onChangeState(stateValues) {
    console.log('stateval',stateValues)
    let stateValue = stateValues.value;
    var reqObjState= {
      "loc":"state",
      "value":stateValue
  }
    this._providerRecipientAuthService.allCountyState(reqObjState).subscribe(
      (res)=>{
        this.countyAd = res.result.counties;
    }

    )
    //this.cityInfo = this.stateInfo[stateValue].Cities;
  }


  getErrorMessageForPassword() {
    if (
      this.authRegistrationSignUpForm.controls.password.hasError('required')
    ) {
      return 'Password is required';
    } else {
      return `Password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }

  getErrorMessageForConfirmPassword() {
    if (
      this.authRegistrationSignUpForm.controls.confirmPassword.hasError(
        'required'
      )
    ) {
      return 'Confirm password is required';
    } else if (
      this.authRegistrationSignUpForm.controls.confirmPassword.hasError(
        'notSame'
      )
    ) {
      return 'Password and confirm password does not match';
    } else {
      return `Confirm password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }

  fetchzipdetails(zipvalue) {
    if(zipvalue.value.length > 4){

    let zip = {
      zip: zipvalue.value,
    };

    this.authRegistrationSignUpForm.get('zip').setErrors({ incorrect: true });
    this._providerRecipientAuthService.fetchdetails(zip).subscribe(
      (res) => {
        this.authRegistrationSignUpForm.controls.city.setValue(res.city);
        this.authRegistrationSignUpForm.controls.state.setValue(res.state);
        this.authRegistrationSignUpForm.controls.country.setValue(res.country);
        this.authRegistrationSignUpForm.controls.county.setValue(res.county);
        this.show = true;
        this.stateshow = false;
        this.authRegistrationSignUpForm.get('zip').setErrors({'incorrect': null});
        this.authRegistrationSignUpForm.get('zip').updateValueAndValidity();
      },
      (err) => {
        this.getError()
        // this.authRegistrationSignUpForm.get('zip').setErrors({ incorrect: true });
        // this._NotificationService.showNotification('Enter valid zip code', 'top', 'error');
      }
    );
  }else{
    this.getError()
  }
  }
  getError(){
    this.show = false;
    this.stateshow = true;
    this.authRegistrationSignUpForm.controls.city.setValue('');
    this.authRegistrationSignUpForm.controls.state.setValue('');
    this.authRegistrationSignUpForm.controls.county.setValue('');
  }
  getage(dateString) {
    let dateObj = new Date(dateString.value);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    // alert('edfsdfsf'+dateString);
    let today = new Date();
    var birthDate = new Date(dateString.value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    let da = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (m < 0) {
      m += 12;
    }
    if (age < 12) {
      return this._NotificationService.showNotification(
        'Age should be greater than 12',
        'top',
        'error'
      );
    }
  }

  openModal1() {
    let config = {
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    };
    const dialogRef = this.dialog.open(ModalPrivacyPolicyComponent, config);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openModal2() {
    let config = {
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    };
    const dialogRef = this.dialog.open(ModalTermsOfUseComponent, config);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  isFormValid(): boolean {
    let formData = this.authRegistrationSignUpForm.value;

    if (!this.authRegistrationSignUpForm.valid) {
      this._NotificationService.showNotification(
        'Please fill the all mandatory fields',
        'bottom',
        'error'
      );
      return false;
    }
    if (!formData.email && !formData.homeno && !formData.phone) {
      this._NotificationService.showNotification(
        'Please Enter Either Email / Mobile Phone Number / Home Phone Number.',
        'top',
        'error'
      );
      return false;
    }


    if (!formData.termandCondition) {
      this._NotificationService.showNotification(
        'Please accept Terms of Service and Privacy Policy',
        'top',
        'error'
      );
      return false;
    }

    return true;
  }

  authRegistrationSignUpFormSub() {
    let formData = this.authRegistrationSignUpForm.value;

    if (!this.isFormValid() || !formData.answers.raceFormArray.length ) {
      this.checkedValidation = formData.answers.raceFormArray.length ? false :true;

      return;
    }


    let mobileNo = formData.phone ?  this.dialCode + formData.phone : ''

    let reqData: any = {
      user:
        formData.primaryType == 'email'
          ? formData.email
          : mobileNo,
      fname: formData.firstName,
      lname: formData.lastName,
      address1: formData.address1,
      address2: formData.address2,
      address3: formData.address3,
      home_number: formData.homeno,
      home_adress: formData.address1 + formData.address2 + formData.address3,
      zip: formData.zip,
      dob: formData.dob ? moment(formData.dob).format('YYYY-MM-DD'): moment('1900-01-01').format('YYYY-MM-DD'),
      gender: formData.gender,
      mobile_number: mobileNo,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      county: formData.county,
      static_questionnaire_answers: [
        {
          question_id: '3',
          question_text: 'Insurance',
          answers: [formData.insurance],
        },
        {
          question_id: '4',
          question_text: 'Insurance Provider Name',
          answers: [formData.insuranceprovidername],
        },
        {
          question_id: '5',
          question_text: 'Medical Group Number',
          answers: [formData.medicalGroupNumber],
        },
        {
          question_id: '6',
          question_text: 'Medical ID',
          answers: [formData.memberId],
        },
        {
          question_id: '1',
          question_text:
            'Which of the following best describes your ethnic group? *',
          answers: [formData.answers.ethnicgroup],
        },
        {
          question_id: '2',
          question_text:
            'Which of the following best describes your race? Please select all that apply? *',
          answers: [...formData.answers.raceFormArray],
        },
        {
          question_id: '12',
          question_text: ' Have you ever had any of the following medical conditions? - Asthama(moderate to severe) - Cancer - Cerebrovascular disease - Chronic Kidney Disease - Chronic obstructive pulmonary disease (COPD) - Cystic fibrosis - Down Syndrome - Heart conditions, such as coronary artery disease or cardiomyopathies - Hypertension or high blood pressure - Immunocompromised state (weakened immune system) - Liver disease - Neurologic conditions, (such as dementia) - Nicotine/smoking addiction - Obesity - Overweight - Pulmonary fibrosis (damaged or scarred lung tissues) - Sickle cell disease - Thalassemia (type of blood disorder) - Type 1 diabetes mellitus - Type 2 diabetes mellitus.',
          answers: [...formData.answers.medicalAllFormArray],
        },
        {
          question_id: '7',
          question_text: 'Select all that apply',
          answers: [...formData.answers.applyAllFormArray],
        },
        {
          question_id: '8',
          question_text:
            'Prescription, over-the- counter medications, dietary supplements, or herbal remedies being taken at the time of Vaccination.',
          answers: [formData.answers.prescriptionQ],
        },
        {
          question_id: '9',
          question_text: 'Allergies to medications, food, or other products:',
          answers: [formData.answers.allergiestomedications],
        },
        {
          question_id: '10',
          question_text:
            'Other illnesses at the time of vaccination and up to one month',
          answers: [formData.answers.otherillnesses],
        },
        {
          question_id: '11',
          question_text: 'Chronic or long-standing health conditions prior',
          answers: [formData.answers.chronicorlongstanding],
        },
      ],
    };

    console.log(reqData);


    this._siteAdminService.checkRecipientDuplicate(reqData)
    .subscribe(({results}) => {
      const existingRecord = results[0];

      if (existingRecord) {
        const modalRef = this.modalService.open(AdminRecipientInviteFormComponent);
        modalRef.componentInstance.recipient = existingRecord;
        modalRef.componentInstance.email = reqData.email;
        modalRef.componentInstance.mobile_number = reqData.mobile_number;
        modalRef.result.then((result) => {
          this.location.back();
        }, (reason) => console.log(reason));
      } else {
        this._siteAdminService.saveWalkin(reqData).subscribe(
          (res) => {
            console.log(res);
            this._NotificationService.showNotification(
              'Recipient successfully Registered',
              'top',
              'success'
            );
            this._router.navigate(['/site-admin/appointment']);
          },
          (err) => {
            console.log(err.error);
            if (err.error.text == '') {
              this._NotificationService.showNotification(
                'Something went wrong',
                'top',
                'error'
              );
            }
          }
        );
      }
    });
  }
}
