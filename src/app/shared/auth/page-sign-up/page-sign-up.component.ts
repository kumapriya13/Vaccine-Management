import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { RecipientAuthService } from '../../../core';
import {
  applicableList,
  passwordContext,
  raceList,
  medicalList,
  GENDER_TYPES,
  GENDER_TYPES_FOR_ADD,
} from '../../helpers/constant';
import { ModalPrivacyPolicyComponent } from '../../modals/modal-privacy-policy/modal-privacy-policy.component';
import { ModalReceipentPreviewComponent } from '../../modals/modal-receipent-preview/modal-receipent-preview.component';
import { ModalTermsOfUseComponent } from '../../modals/modal-terms-of-use/modal-terms-of-use.component';
import { CountriesService } from '../../services/countries.service';
import { NotificationService } from '../../services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipientInviteFormComponent } from '../../components/recipient-invite-form/recipient-invite-form.component';

@Component({
  selector: 'app-page-sign-up',
  templateUrl: './page-sign-up.component.html',
  styleUrls: ['./page-sign-up.component.scss'],
  providers: [
    // { provide: DateAdapter, useClass: AppDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class PageSignUpComponent implements OnInit {
  dialCode: string = '+1';
  iso2: string = 'us';

  passwordToggler: boolean;
  returnUrl: string;
  authRecipientSignUpForm: FormGroup;
  raceList: any[] = raceList;
  applicableList: any[] = applicableList;
  medicalList: any[] = medicalList;
  public show: boolean = false;
  public stateshow: boolean = true;
  // public show: boolean = true;
  // public stateshow: boolean = false;
  public qaList: boolean = true;
  genderData = GENDER_TYPES_FOR_ADD;

  stateInfo: any[] = [];
 // countryInfo: any[] = [];
  countryInfo: any;
  cityInfo: any[] = [];
  passwordContext = passwordContext;
  hide: boolean = true;
  maxDate: Date;


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
  isUserEmailRegestered: boolean = false;
  isUserPhoneRegestered: boolean = false;


  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private _NotificationService: NotificationService,
    private country: CountriesService,
    private modalService: NgbModal,
    public dialog: MatDialog
  ) {
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const currentDate = currentDateObj.getDate();

    this.maxDate = new Date(currentYear - 12, currentMonth, currentDate);

    // this.maxDate = new Date(currentYear + 1, 11, 31);
    // this._providerRecipientAuthService.navToDashboradIfAuthenticated();
  }

  ngOnInit(): void {
    let formData = JSON.parse(localStorage.getItem('recipient-preview'));
    formData = formData ? formData : false;
    this.buildForm(formData);

    this.passwordToggler = false;
    this.getCountries();
  }

  siteKey = environment.captchaKey;

  handleSuccess(e) {
    console.log('ReCaptcha', e);
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  buildForm(dataFromLoc = false) {
    if (dataFromLoc) {
      this.dialCode = dataFromLoc['dialCode'];
      this.iso2 = dataFromLoc['iso2'];
    }

    this.authRecipientSignUpForm = this._formBuilder.group({
      firstName: [
        dataFromLoc ? dataFromLoc['firstName'] : '',
        [Validators.required],
      ],
      lastName: [
        dataFromLoc ? dataFromLoc['lastName'] : '',
        [Validators.required],
      ],
      dob: [dataFromLoc ? dataFromLoc['dob'] : '', [Validators.required]],
      gender: [dataFromLoc ? dataFromLoc['gender'] : '', [Validators.required]],
      phone: [
        dataFromLoc ? dataFromLoc['phone'] : '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      email: [
        dataFromLoc ? dataFromLoc['email'] : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
        ],
      ],
      primaryType: [
        dataFromLoc ? dataFromLoc['primaryType'] : 'email',
        [Validators.required],
      ],
      address1: [
        dataFromLoc ? dataFromLoc['address1'] : '',
        [Validators.required],
      ],
      address2: [dataFromLoc ? dataFromLoc['address2'] : ''],
      address3: [dataFromLoc ? dataFromLoc['address3'] : ''],
      homePhoneNumber: [dataFromLoc ? dataFromLoc ['homePhoneNumber']: ''],
      city: [dataFromLoc ? dataFromLoc['city'] : '', [Validators.required]],
      password: [
        dataFromLoc ? dataFromLoc['password'] : '',
        [
          Validators.required,
          Validators.minLength(this.passwordContext.passwordMinLen),
          Validators.pattern(
            '^(?=.*[0-9])' +
              '(?=.*[a-z])(?=.*[A-Z])' +
              '(?=.*[!@#$%^&+=])' +
              '(?=\\S+$).{8,15}$'
          ),
        ],
      ],
      confirmPassword: [
        dataFromLoc ? dataFromLoc['confirmPassword'] : '',
        [
          Validators.required,
          Validators.minLength(this.passwordContext.passwordMinLen),
        ],
      ],
      zip: [
        dataFromLoc ? dataFromLoc['zip'] : '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      termandCondition: [
        dataFromLoc ? dataFromLoc['termandCondition'] : false,
        [Validators.required],
      ],
      state: [dataFromLoc ? dataFromLoc['state'] : '', [Validators.required]],
      country: [dataFromLoc ? dataFromLoc['country'] : 'United States'],
      county: [dataFromLoc ? dataFromLoc['county'] : '', [Validators.required]],
      insurance: [dataFromLoc ? dataFromLoc['insurance'] : ''],
      insuranceprovidername: [
        dataFromLoc ? dataFromLoc['insuranceprovidername'] : '',
      ],
      medicalGroupNumber: [
        dataFromLoc ? dataFromLoc['medicalGroupNumber'] : '',
      ],
      memberId: [dataFromLoc ? dataFromLoc['memberId'] : ''],
      answers: this._formBuilder.group({
        ethnicgroup: [
          dataFromLoc ? dataFromLoc['answers']['ethnicgroup'] : '',
          [Validators.required],
        ],
        raceFormArray: this._formBuilder.array(
          dataFromLoc ? dataFromLoc['answers']['raceFormArray'] : [],
          [Validators.required]
        ),
        applyAllFormArray: this._formBuilder.array(
          dataFromLoc ? dataFromLoc['answers']['applyAllFormArray'] : []
        ),
        medicalAllFormArray: this._formBuilder.array(
          dataFromLoc ? dataFromLoc['answer']['medicalAllFormArray'] : []
        ),
        prescriptionQ: [
          dataFromLoc ? dataFromLoc['answers']['prescriptionQ'] : '',
        ],
        allergiestomedications: [
          dataFromLoc ? dataFromLoc['answers']['allergiestomedications'] : '',
        ],
        otherillnesses: [
          dataFromLoc ? dataFromLoc['answers']['otherillnesses'] : '',
        ],
        chronicorlongstanding: [
          dataFromLoc ? dataFromLoc['answers']['chronicorlongstanding'] : '',
        ],
      }),
      recaptcha: [''],
    });
  }

  changeGender(e) {
    this.authRecipientSignUpForm.get('gender').setValue(e.target.value, {
      onlySelf: true,
    });
  }

  onCountryChange(event) {
    this.dialCode = '+' + event.dialCode;
    this.iso2 = event.iso2;
    this.checkUserPhoneExist();
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
  omit_special_char(event) {
    var k;
    k = event.charCode;
    console.log(k);
    if (k == 44) {
      return false;
    }
    //         k = event.keyCode;  (Both can be used)
    //  return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onPaste(event) {
    return false;
  }
  onRaceCheckboxChange(value: string, isChecked: boolean) {
    const raceFormArray = <FormArray>(
      (<FormGroup>this.authRecipientSignUpForm.controls.answers).controls
        .raceFormArray
    );
    if (isChecked) {
      raceFormArray.push(new FormControl(value));
    } else {
      let index = raceFormArray.controls.findIndex((x) => x.value == value);
      raceFormArray.removeAt(index);
    }
  }

  onSelectAllCheckboxChange(value: string, isChecked: boolean) {
    const applyAllFormArray = <FormArray>(
      (<FormGroup>this.authRecipientSignUpForm.controls.answers).controls
        .applyAllFormArray
    );

    if (isChecked) {
      applyAllFormArray.push(new FormControl(value));
    } else {
      let index = applyAllFormArray.controls.findIndex((x) => x.value == value);
      applyAllFormArray.removeAt(index);
    }
  }

  onSelectAllRadioChange(value: string, isChecked: boolean) {
    const medicalAllFormArray = <FormArray>(
      (<FormGroup>this.authRecipientSignUpForm.controls.answers).controls
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
        this.authRecipientSignUpForm.controls.country.setValue('US');
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
    if (this.authRecipientSignUpForm.controls.password.hasError('required')) {
      return 'Password is required';
    } else if (
      this.authRecipientSignUpForm.controls.password.hasError('pattern')
    ) {
      return `Password must be use 8-15 characters 1 uppercase, lowercase, numbers, special characters.`;
    } else {
      return `Password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }

  getErrorMessageForConfirmPassword() {
    if (
      this.authRecipientSignUpForm.controls.confirmPassword.hasError('required')
    ) {
      return 'Confirm password is required';
    } else if (
      this.authRecipientSignUpForm.controls.confirmPassword.hasError('notSame')
    ) {
      return 'confirm password does not match';
    } else {
      return `Confirm password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }

  checkUserEmailExist() {
    let email = this.authRecipientSignUpForm.get('email').value;
    return;
    this._providerRecipientAuthService.checkUserAvailable(email).subscribe(
      (res: any) => {
        if (res.result == 'unavailable') {
          this.isUserEmailRegestered = true;
          this.isFormValid();
        } else {
          this.isUserEmailRegestered = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkUserPhoneExist() {
    let phone = this.authRecipientSignUpForm.get('phone').value;
    return;
    this._providerRecipientAuthService
      .checkUserAvailable(this.dialCode + phone)
      .subscribe((res: any) => {
        if (res.result == 'unavailable') {
          this.isUserPhoneRegestered = true;
          this.isFormValid();
        } else {
          this.isUserPhoneRegestered = false;
        }
      });
  }

  fetchzipdetails(zipvalue) {
    if(zipvalue.value.length > 4){

    let zip = {
      zip: zipvalue.value,
    };

    this._providerRecipientAuthService.fetchdetails(zip).subscribe(
      (res) => {
        this.authRecipientSignUpForm.controls.city.setValue(res.city);
        this.authRecipientSignUpForm.controls.state.setValue(res.state);
        this.authRecipientSignUpForm.controls.country.setValue(res.country);
        this.authRecipientSignUpForm.controls.county.setValue(res.county);
        this.show = true;
        this.stateshow = false;
      },
      (err) => {
        this.getError()
        this._NotificationService.showNotification(
          'Enter valid zip code',
          'top',
          'error'
        );
      }
    );

  }else{
    this.getError()
  }
  }
  getError(){
    this.show = false;
    this.stateshow = true;
    this.authRecipientSignUpForm.controls.city.setValue('');
    this.authRecipientSignUpForm.controls.state.setValue('');
    this.authRecipientSignUpForm.controls.county.setValue('');
  }
  getage() {
    let today = new Date();
    var birthDate = this.authRecipientSignUpForm.value.dob;

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
        'Age should be greater than 12',
        'top',
        'error'
      );
    }
  }

  isFormValid(): boolean {
    let formData = this.authRecipientSignUpForm.value;

    if (this.isUserEmailRegestered) {
      this._NotificationService.showNotification(
        'Email ID Already Registered',
        'top',
        'error'
      );
      return false;
    }

    if (this.isUserPhoneRegestered) {
      this._NotificationService.showNotification(
        'Mobile Phone Number Already Registered',
        'top',
        'error'
      );
      return false;
    }

    if (!this.authRecipientSignUpForm.valid) {
      this._NotificationService.showNotification(
        'Please fill the all mandatory fields',
        'bottom',
        'error'
      );
      return false;
    }

    if (
      String(this.authRecipientSignUpForm.get('recaptcha').value).trim() == ''
    ) {
      this._NotificationService.showNotification(
        'Please select the recaptcha code',
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
  isSubmit: boolean = false;
  authRecipientSignUpFormSub() {
    this.isSubmit = true;
    if (!this.isFormValid()) return;

    let formData = this.authRecipientSignUpForm.value;

    let dateObj = new Date(formData.dob);

    let reqData: any = {
      user:
        formData.primaryType == 'email'
          ? formData.email
          : this.dialCode + formData.phone,
      password: formData.password,
      fname: formData.firstName,
      lname: formData.lastName,
      address1: formData.address1,
      address2: formData.address2,
      address3: formData.address3,
      home_number: formData.homePhoneNumber,
      home_adress: formData.address1 + formData.address2 + formData.address3,
      zip: formData.zip,
      dob: moment(formData.dob).format('YYYY-MM-DD'),
      gender: formData.gender,
      mobile_number: this.dialCode + formData.phone,
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
          question_id: '7',
          question_text: 'Select all that apply',
          answers: [...formData.answers.applyAllFormArray],
        },
        {
          question_id: '12',
          question_text: ' Have you ever had any of the following medical conditions? - Asthama(moderate to severe) - Cancer - Cerebrovascular disease - Chronic Kidney Disease - Chronic obstructive pulmonary disease (COPD) - Cystic fibrosis - Down Syndrome - Heart conditions, such as coronary artery disease or cardiomyopathies - Hypertension or high blood pressure - Immunocompromised state (weakened immune system) - Liver disease - Neurologic conditions, (such as dementia) - Nicotine/smoking addiction - Obesity - Overweight - Pulmonary fibrosis (damaged or scarred lung tissues) - Sickle cell disease - Thalassemia (type of blood disorder) - Type 1 diabetes mellitus - Type 2 diabetes mellitus.',
          answers: [...formData.answers.medicalAllFormArray],
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

    /*** Dynamic qustion changes by : Deepak for: #338 #342 */
    if (reqData['state'].toLowerCase().trim() == 'ny')
      reqData['state'] = formData['state'] = 'New York';
    else if (reqData['state'].toLowerCase().trim() == 'nj')
      reqData['state'] = formData['state'] = 'New Jersey';

    this._providerRecipientAuthService
      .recipientUserCheck({ user: reqData.user })
      .subscribe((_recipientUserCheckResponse) => {
        if (_recipientUserCheckResponse.result === 'unavailable') {
          let errorMsg =
            formData.primaryType == 'email'
              ? 'Email Already Exists'
              : 'Phone Number Already Exists';
          this._NotificationService.showNotification(errorMsg, 'top', 'error');
          return;
        } else {
          this._providerRecipientAuthService.recipientCheckDuplicate(
            reqData.fname,
            reqData.lname,
            reqData.dob,
            reqData.email,
            reqData.mobile_number,
          ).subscribe((existingRecord) => {
            if (existingRecord) {
              const modalRef = this.modalService.open(RecipientInviteFormComponent);
              modalRef.componentInstance.recipient = existingRecord;
              modalRef.componentInstance.email = reqData.email;
              modalRef.componentInstance.mobile_number = reqData.mobile_number;
              modalRef.result.then((result) => {
                this._router.navigateByUrl('/');
              }, (reason) => console.log(reason));
            } else {
              this.register(reqData);
            }
          });
        } //else
      }); //recipientUserCheck
  } //function end

  register(reqData: any): void {
    let reqObj = {
      criteria: {
        country: 'United States of America',
        state: [reqData.state],
        language: 'english',
        county: reqData.county,
      },
      page: 1,
      pageLength: 10,
      sort: '',
    };
    this._providerRecipientAuthService
      .getDynamicQuestions(reqObj)
      .subscribe(
        (_dqres) => {
          console.log(
            'Respnse received : ' +
              _dqres.results[0]?.dynamic_questionnaire_answers?.length
          );
          if (
            _dqres.results[0]?.dynamic_questionnaire_answers?.length > 0
          ) {
            localStorage.setItem(
              'tempRegistringUser',
              JSON.stringify(reqData)
            );
            this._router.navigate(['/auth/register-ques-ans'], {
              queryParams: {
                state: reqData['state'],
                county: reqData['county'],
              },
            });
          } else {
            // if no dq
            this._providerRecipientAuthService
              .recipientSignUp(reqData)
              .subscribe(
                (_recipientSignUpResp) => {
                  localStorage.removeItem('recipient-preview');
                  this.authRecipientSignUpForm.reset();
                  this.isSubmit = false;
                  this._router.navigate(['/auth/verify-otp']);
                },
                (err) => {
                  if (err.error.text == '') {
                    this._NotificationService.showNotification(
                      err.error.text,
                      'top',
                      'error'
                    );
                  }
                }
              ); //recipientSignUp
          }
        },
        (err) => {
          console.log('Error : ' + err);
          this.isSubmit = false;
        }
      );
  }

  // isSubmit: boolean = false;
  viewPreview() {
    this.isSubmit = true;
    if (!this.isFormValid()) return;

    let formData = this.authRecipientSignUpForm.value;
    formData['dialCode'] = this.dialCode;
    formData['iso2'] = this.iso2;

    let config = {
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { formData: formData },
    };

    const dialogRef = this.dialog.open(ModalReceipentPreviewComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == 'next') this.authRecipientSignUpFormSub();
    });
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

  getDynamicQuestions(state: string, county: string) {
    let reqObj = {
      criteria: {
        country: 'United States of America',
        state: [state],
        language: 'english',
        county: county,
      },
      page: 1,
      pageLength: 10,
      sort: '',
    };
    this._providerRecipientAuthService.getDynamicQuestions(reqObj).subscribe(
      (res) => {
        this.qaList = res.results[0].dynamic_questionnaire_answers;
      },
      (err) => {
        console.log('DynamicQuestions error :' + err);
      }
    );
  }
}

// latest changes code need to implement later
// authRecipientSignUpFormSubPre() {
//   if (!this.isFormValid()) return;

//   let formData = this.authRecipientSignUpForm.value;

//   let dateObj = new Date(formData.dob);
//   let year = dateObj.getFullYear();
//   let month = dateObj.getMonth() + 1;
//   let date = dateObj.getDate();

//   // user:
//   //     formData.primaryType == 'email'
//   //       ? formData.email
//   //       : this.dialCode + formData.phone,
//   //   password: formData.password,

//   let reqData = {
//     "lname": formData.lastName,
//     "fname": formData.firstName,
//     "dob": String(year + '-' + month + '-' + date),
//     "gender": formData.gender,
//     "email": formData.email,
//     "mobile_number": this.dialCode + formData.phone,
//     // "latitude": 25.6615,
//     // "longitude": -80.441,
//     // "geopoint": "25.6615,-80.441",
//     "address1": formData.address1,
//     "address2": formData.address2,
//     "address3": formData.address3,
//     "city": formData.city,
//     "state": formData.state,
//     "zip": formData.zip,
//     "county": formData.county,
//     "country": formData.country,
//     // "health_worker_category": "doctor",
//     // "is_vaccinator": true,
//     // "is_eligible": true,
//     // "eligibility_status": "3",
//     // "eligiblity_reason": "",
//     // "comorbidities": [],
//     // "dynamic_questionnaire_id": "5f20b956-b62a-4624-98cb-844f58c70f4f",
//     // "dynamic_questionnaire_answers": [
//     //   {
//     //     "QuestionnaireAnswer": {
//     //       "question_id": "1",
//     //       "question_text": "Select all that apply",
//     //       "options": ["X", "Y", "Z"],
//     //       "answers": ["X", "Z"]
//     //     }
//     //   },
//     //   {
//     //     "QuestionnaireAnswer": {
//     //       "question_id": "2",
//     //       "question_text": "Allergies to medications, food, or other products:",
//     //       "options": [],
//     //       "answers": ["Only aspirin"]
//     //     }
//     //   },
//     //   {
//     //     "QuestionnaireAnswer": {
//     //       "question_id": "3",
//     //       "question_text": "Chronic or long-standing health conditions prior",
//     //       "options": ["Yes", "No"],
//     //       "answers": ["No"],
//     //       "answer_min": 1,
//     //       "answer_max": 1
//     //     }
//     //   }
//     // ],
//     // "static_questionnaire_id": "3Df0b956-b62a-4624-98cb-844f58c70f4f",
//     "static_questionnaire_answers": [
//       {
//         "question_id": "1",
//         "question_text": "Which of the following best describes your ethnic group",
//         "options": ["Hispanic", "Non-Hispanic"],
//         "answers": ["TEST-02 Hispanic"],
//         "answer_min": 1,
//         "answer_max": 1
//       },
//       {
//         "question_id": "2",
//         "question_text": "Which of the following best describes your race? Please select all that apply",
//         "options": [
//           "White",
//           "Black or African-American",
//           "Asian or Asian-American",
//           "Native American/American Indian/Alaska Native",
//           "Pacific Islander/Native Hawaiian",
//           "Hispanic/Latino",
//           "Other",
//           "Unknown"
//         ],
//         "answers": ["TEST-02 Asian or Asian-American", "Other"],
//         "answer_min": 1
//       }
//     ],
//     // "recipient_facts": [
//     //   {
//     //     "RecipientFact": {
//     //       "first_dose_allocated_flag": 0,
//     //       "second_dose_allocated_flag": 0,
//     //       "third_dose_allocated_flag": 0,
//     //       "first_dose_date": "",
//     //       "second_dose_date": "",
//     //       "third_dose_date": "",
//     //       "first_status": "Not Done",
//     //       "second_status": "Not Done",
//     //       "third_status": "Not Done",
//     //       "first_dose_not_done_reason": "",
//     //       "second_dose_not_done_reason": "",
//     //       "third_dose_not_done_reason": "",
//     //       "registered_date": "2020-05-18",
//     //       "first_appointment_id": "",
//     //       "second_appointment_id": "",
//     //       "third_appointment_id": "",
//     //       "is_deleted": false
//     //     }
//     //   }
//     // ]
//   };
//   return;
//   let reqData1: any = {
//     static_questionnaire_answers: [
//       {
//         question_id: '1',
//         question_text: 'Insurance',
//         answers: [formData.insurance],
//       },
//       {
//         question_id: '2',
//         question_text: 'Insurance Provider Name',
//         answers: [formData.insuranceprovidername],
//       },
//       {
//         question_id: '3',
//         question_text: 'Medical Group Number',
//         answers: [formData.medicalGroupNumber],
//       },
//       {
//         question_id: '4',
//         question_text: 'Medical ID',
//         answers: [formData.memberId],
//       },
//       {
//         question_id: '5',
//         question_text:
//           'Which of the following best describes your ethnic group? *',
//         answers: [formData.answers.ethnicgroup],
//       },
//       {
//         question_id: '6',
//         question_text:
//           'Which of the following best describes your race? Please select all that apply? *',
//         answers: [...formData.answers.raceFormArray],
//       },
//       {
//         question_id: '7',
//         question_text: 'Select all that apply',
//         answers: [...formData.answers.applyAllFormArray],
//       },
//       {
//         question_id: '8',
//         question_text:
//           'Prescription, over-the- counter medications, dietary supplements, or herbal remedies being taken at the time of Vaccination.',
//         answers: [formData.answers.prescriptionQ],
//       },
//       {
//         question_id: '9',
//         question_text: 'Allergies to medications, food, or other products:',
//         answers: [formData.answers.allergiestomedications],
//       },
//       {
//         question_id: '10',
//         question_text:
//           'Other illnesses at the time of vaccination and up to one month',
//         answers: [formData.answers.otherillnesses],
//       },
//       {
//         question_id: '11',
//         question_text: 'Chronic or long-standing health conditions prior',
//         answers: [formData.answers.chronicorlongstanding],
//       },
//     ],
//   };

//   console.log(reqData);
//   return;
//   this._providerRecipientAuthService.recipientSignUp(reqData).subscribe(
//     (res) => {
//       localStorage.removeItem('recipient-preview');
//       this.authRecipientSignUpForm.reset();
//       this._router.navigate(['/auth/verify-otp']);
//     },
//     (err) => {
//       if (err.error.text == '') {
//         this._NotificationService.showNotification(
//           'Something went wrong',
//           'top',
//           'error'
//         );
//       }
//       this._NotificationService.showNotification(
//         err.error.text,
//         'top',
//         'error'
//       );
//     }
//   );
// }
