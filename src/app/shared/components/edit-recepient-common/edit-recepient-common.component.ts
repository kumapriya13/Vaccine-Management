import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, race, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { RecipientAuthService } from 'src/app/core/services/auth/recipient-auth.service';
import { ReceptionistService } from 'src/app/core/services/receptionist.service';
import { UserService } from 'src/app/core/services/user.service';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  applicableList,
  raceList,
  GENDER_TYPES,
  medicalList,
  GENDER_TYPES_FOR_ADD,
  COUNTIES,ETHNICITY_LIST
} from '../../helpers/constant';
import intlTelInput from 'intl-tel-input';
import { DatePipe } from '@angular/common';
import { isArray } from 'lodash';
import { SiteAdminService } from 'src/app/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminRecipientInviteFormComponent } from '../admin-recipient-invite-form/recipient-invite-form.component';
import { ModalTermsOfUseComponent } from '../../modals/modal-terms-of-use/modal-terms-of-use.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalPrivacyPolicyComponent } from '../../modals/modal-privacy-policy/modal-privacy-policy.component';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'edit-recepient-common',
  templateUrl: './edit-recepient-common.component.html',
  styleUrls: ['./edit-recepient-common.component.scss'],
})
export class EditRecepientCommonComponent implements OnInit {
  isCheckedInUser:boolean = false;
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
  medicalList: any[] = medicalList;
  maxDate: Date;
  genderData = GENDER_TYPES_FOR_ADD;
  isSubmit: boolean = false;
  temp: any;
  recipientId: string;
  serviceSubscription: Subscription[] = [];
  @Input() redirection;
  @Input() redirectionAfterSave;
  @Input() is_allow_private = false;
  @Input() remove_submit = false;
  @Input() recepient_only = false;
  @Input() disable_form = false;
  @Input() isNew: boolean = false;
  isFromWalkinPage: any = 'true';
  issubmitted: boolean = false;
  @Input('recepient')
  set recepient(value: string) {
    this.recipientId = value;
    if (this.recipientId) {
      this.setFormControlValue();
    }
  }

  @Input('fromWalkinPage')
  set fromWalkinPage(value: string) {
    if (value == 'noCheckList' || value == '') {
      this.isFromWalkinPage = 'true';
    } else {
      this.isFromWalkinPage = value;
    }
  }

  public stateshow: boolean = true;

  countyAd = COUNTIES;
  currentRecipientProfile: any = {};
  static_questionnaire_answers: any[];
  insuranceIndex: number;
  insuranceprovidernameIndex: number;
  medicalGroupNumberIndex: number;
  memberIdIndex: number;
  ethnicityList = ETHNICITY_LIST 
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private _providerRecipientAuthService: RecipientAuthService,
    private country: CountriesService,
    private _superAdminService: ReceptionistService,
    private _NotificationService: NotificationService,
    private datepipe: DatePipe,
    private _siteAdminService: SiteAdminService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private _spinner: SpinnerService,
  ) {
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const currentDate = currentDateObj.getDate();

    this.maxDate = new Date(currentYear - 12, currentMonth, currentDate);
  }

  ngOnInit(): void {
    this.buildForm();
    //this.setFormControlValue();
    this.getCountries();
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  ngAfterViewInit(){
  //   this.flagRef.intlTelInput({ 
  //     initialCountry: "sd",
  //     separateDialCode: true 
  // });
  //this.elementRef.nativeElement.getElementById('flagRef')
  //.addEventListener('click', this.onCountryChange.bind(this));

  //let data = new Ng2TelInput();
  //let data = Ng2TelInput.prototype.setCountry('gb')
  //console.log("data event",data);
    // intlTelInput({this.flagRef})
  }
  onLoadCountryChange(event) {
    setTimeout(() => {
    //alert(this.iso2)
    //console.log("event load 1",event);
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


  

  buildForm() {
    this.iso2 = this.isNew ? 'us' : '';
    this.authRecipientEditForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      phoneNumber: ['',Validators.pattern("^[0-9]*$")],
      countryFlag: [''],
      homeno: [''],
      dob: ['', [Validators.required]],
      gender: [''],
      address1: [''],
      address2: [''],
      address3: [''],
      city: [''],
      zip: [''],
      termandCondition: [this.isNew ? '' : 'true', [Validators.required]],
      state: [''],
      country: [''],
      county: [''],
      insurance: [''],
      insuranceprovidername: [''],
      medicalGroupNumber: [''],
      memberId: [''],
      is_allow_private: [],
      answers: this._formBuilder.group({
        ethnicgroup: ['', [Validators.required]],
        raceFormArray: this._formBuilder.array(
          [],
          multipleCheckboxRequireOne()
        ),
        applyAllFormArray: this._formBuilder.array([]),
        medicalAllFormArray: [''],
        prescriptionQ: [''],
        allergiestomedications: [''],
        otherillnesses: [''],
        chronicorlongstanding: [''],
      }),
    });
    this.buildApplyAllFormArray();
    this.buildRaceFormArray();
  }

  get raceFormArray() {
    let controls = this.authRecipientEditForm.controls.answers;
    return controls.get('raceFormArray') as FormArray;
  }
  get applyAllFormArray() {
    let controls = this.authRecipientEditForm.controls.answers;
    return controls.get('applyAllFormArray') as FormArray;
  }

  buildRaceFormArray() {
    if (this.raceFormArray) {
      this.raceList.map((data) => {
        this.raceFormArray.push(new FormControl(false));
      });
    }
  }

  buildApplyAllFormArray() {
    //console.log("applyFormArray",this.applicableList);
    if (this.applyAllFormArray) {
      this.applicableList.map((data) => {
        this.applyAllFormArray.push(new FormControl(false));
      });
    }
  }

  patchRaceFormArrayValues(value) {
    if (this.disable_form) {
      this.authRecipientEditForm.disable();
    }
    let indexes = [];
    if (value.length) {
     let racecase = value.map(name => name.toLowerCase())
      this.raceList.map((data) => {
        if (racecase.indexOf(data.value.toLowerCase()) > -1) {
          indexes.push(true);
        } else {
          indexes.push(null);
        }
      });
    }
    return indexes
    // if (
    //   this.currentRecipientProfile &&
    //   this.currentRecipientProfile.hasOwnProperty(
    //     'static_questionnaire_answers'
    //   )
    // ) {
    //   let answers =
    //     this.currentRecipientProfile.static_questionnaire_answers.filter(
    //       (d) => {
    //         return d.question_id == value;
    //       }
    //     );
    //   //console.log("answers",answers[0].answers);
    //   if (
    //     answers &&
    //     answers.length > 0 &&
    //     answers[0].hasOwnProperty('answers') &&
    //     answers[0].answers.length > 0
    //   ) {
    //     this.raceList.map((data) => {
    //       if (answers[0].answers.indexOf(data.value) > -1) {
    //         //console.log("sdsdsds",this.raceFormArray.controls);
    //         indexes.push(true);
    //       } else {
    //         indexes.push(null);
    //       }
    //     });
    //   } else {
    //     this.raceList.map((data) => {
    //       indexes.push(null);
    //     });
    //   }
    // } else {
    //   this.raceList.map((data) => {
    //     indexes.push(null);
    //   });
    // }

    // return indexes;
  }

  patchApplyFormArrayValues(value) {
    let indexes = [];
    if (
      this.currentRecipientProfile &&
      this.currentRecipientProfile.hasOwnProperty(
        'static_questionnaire_answers'
      )
    ) {
      let answers =
        this.currentRecipientProfile.static_questionnaire_answers.filter(
          (d) => {
            return d.question_id == value;
          }
        );
      //console.log("answers",answers[0].answers);
      if (
        answers &&
        answers.length > 0 &&
        answers[0].hasOwnProperty('answers') &&
        answers[0].answers.length > 0
      ) {
        this.applicableList.map((data) => {
          if (answers[0].answers.indexOf(data.value) > -1) {
            //console.log("sdsdsds",this.raceFormArray.controls);
            indexes.push(true);
          } else {
            indexes.push(null);
          }
        });
      } else {
        this.raceList.map((data) => {
          indexes.push(null);
        });
      }
    } else {
      this.raceList.map((data) => {
        indexes.push(null);
      });
    }

    return indexes;
  }

  findAnswer(value) {
    if (this.currentRecipientProfile && this.currentRecipientProfile.hasOwnProperty('static_questionnaire_answers')) {
      let data =
        this.currentRecipientProfile.static_questionnaire_answers.filter(
          (d) => {
            return d.question_id == value;
          }
        );
      if (data && data.length > 0 && data[0].hasOwnProperty('answers') && isArray(data[0].answers) && data[0].answers.length > 0) {
        return data[0].answers[0];
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  setFormControlValue() {
    if(this.isNew) return;
    this._spinner.showLoader();
    let subscription: Observable<any>;
    let reqData: any;
    if (this.recepient_only) {
      subscription = this._superAdminService.getUserById(this.recipientId);
    } else {
      reqData = {
        q: 'id=' + this.recipientId,
        page: 1,
        pageLength: 10,
        sort: '',
      };
      subscription = this._superAdminService.getRecepientData(reqData);
    }

    //this._superAdminService.getRecepientData(reqData).subscribe(
    this.isCheckedInUser = false;
    this.serviceSubscription.push(
      subscription.subscribe((response) => {
        this._spinner.hideLoader();
        if (this.recepient_only) {
          this.currentRecipientProfile = response;
        } else {
          this.currentRecipientProfile = response.results[0];
          let visitsList = response.results[0].$expanded.booked_visits;
          visitsList.forEach(element => {
            if(element.visit_status == 'checked-in')
                this.isCheckedInUser = true;
          });
        }

        //console.log("this.findAnswer",...this.findAnswer(1).answers)
        let questionnaire_answers: any[] = [];
        let static_questionnaire_answers: any[] = [];

        if (
          this.currentRecipientProfile.hasOwnProperty('questionnaire_answers')
        ) {
          questionnaire_answers =
            this.currentRecipientProfile['questionnaire_answers'];
        }
        if (
          this.currentRecipientProfile.hasOwnProperty(
            'static_questionnaire_answers'
          )
        ) {
          static_questionnaire_answers =
            this.currentRecipientProfile['static_questionnaire_answers'];
        }

        if (
          questionnaire_answers.length == 0 &&
          static_questionnaire_answers.length == 0
        ) {
          static_questionnaire_answers = [
            {
              question_id: '3',
              question_text: 'Insurance',
              answers: [''],
            },
            {
              question_id: '4',
              question_text: 'Insurance Provider Name',
              answers: [''],
            },
            {
              question_id: '5',
              question_text: 'Medical Group Number',
              answers: [''],
            },
            {
              question_id: '6',
              question_text: 'Medical ID',
              answers: [''],
            },
            {
              question_id: '1',
              question_text:
                'Which of the following best describes your ethnic group? *',
              answers: [],
            },
            {
              question_id: '2',
              question_text:
                'Which of the following best describes your race? Please select all that apply? *',
              answers: [],
            },
            {
              question_id: '7',
              question_text: 'Select all that apply',
              answers: [],
            },
            {
              question_id: '8',
              question_text:
                'Prescription, over-the- counter medications, dietary supplements, or herbal remedies being taken at the time of Vaccination.',
              answers: [],
            },
            {
              question_id: '9',
              question_text:
                'Allergies to medications, food, or other products:',
              answers: [],
            },
            {
              question_id: '10',
              question_text:
                'Other illnesses at the time of vaccination and up to one month',
              answers: [],
            },
            {
              question_id: '11',
              question_text: 'Chronic or long-standing health conditions prior',
              answers: [],
            },
          ];
        }

        this.static_questionnaire_answers =
          static_questionnaire_answers.length > 0
            ? static_questionnaire_answers
            : questionnaire_answers;

        if (
          !!this.static_questionnaire_answers &&
          this.static_questionnaire_answers.length > 0
        ) {
          this.insuranceIndex = this.static_questionnaire_answers.findIndex(
            (ques) =>
              String(ques.question_text).toLowerCase().trim() ===
              'Insurance'.toLowerCase().trim()
          );
          this.insuranceprovidernameIndex =
            this.static_questionnaire_answers.findIndex(
              (ques) =>
                String(ques.question_text).toLowerCase().trim() ===
                'Insurance Provider Name'.toLowerCase().trim()
            );
          this.medicalGroupNumberIndex =
            this.static_questionnaire_answers.findIndex(
              (ques) =>
                String(ques.question_text).toLowerCase().trim() ===
                'Medical Group Number'.toLowerCase().trim()
            );
          this.memberIdIndex = this.static_questionnaire_answers.findIndex(
            (ques) =>
              String(ques.question_text).toLowerCase().trim() ===
              'Medical ID'.toLowerCase().trim()
          );
        }
        let dob;
        //this.iso2 = ('countryFlag' in this.currentRecipientProfile && this.currentRecipientProfile.countryFlag.hasOwnProperty('iso2')) ? this.currentRecipientProfile.countryFlag.iso2 : '';
        if (
          !this.currentRecipientProfile.dob ||
          this.currentRecipientProfile.dob == '1900-01-01'
        ) {
          dob = '';
        } else {
          dob = new Date(this.currentRecipientProfile.dob?.replace(/-/g, '/'));
        }
        if (this.currentRecipientProfile.state) {
          this.onChangeState(this.currentRecipientProfile.state);
        }

        if (this.currentRecipientProfile.zip) {
          this.show = true;
          this.stateshow = false;
        }


        if(this.currentRecipientProfile.mobile_number==null){
          this.currentRecipientProfile.mobile_number='';
          this.iso2 = 'us';
        } else {
          // for old records
          let iso2: number = this.iso2.toString().trim().length;
          let mob: number = this.currentRecipientProfile.mobile_number.toString().trim().length;
          if (mob !== 0) {
            if(this.currentRecipientProfile.mobile_number.indexOf('+1') > -1){
              this.iso2 = 'us';
              this.currentRecipientProfile.mobile_number = this.currentRecipientProfile.mobile_number.replace("+1","")
              console.log("event us");
            }
            else if(this.currentRecipientProfile.mobile_number.indexOf('+91') > -1){
              this.iso2 = 'in';
              this.currentRecipientProfile.mobile_number = this.currentRecipientProfile.mobile_number.replace("+91","")
              console.log("event in");
            }  else {
              this.iso2 = 'us';
            }
          } else {
            this.iso2 = 'us';
          }
        }

        let req = {
          firstName: this.currentRecipientProfile.fname
            ? this.currentRecipientProfile.fname
            : '',

          lastName: this.currentRecipientProfile.lname
            ? this.currentRecipientProfile.lname
            : '',

          email: this.currentRecipientProfile.email
            ? this.currentRecipientProfile.email
            : '',

          phoneNumber: this.currentRecipientProfile.mobile_number
            ? this.currentRecipientProfile.mobile_number
            : '',

          dob: dob,

          gender: this.currentRecipientProfile.gender
            ? this.titleCaseWord(this.currentRecipientProfile.gender)
            : '',

          homeno: this.currentRecipientProfile.home_number
            ? this.currentRecipientProfile.home_number
            : '',

          //  home_number: formData.homeno,

          address1: this.currentRecipientProfile.address1
            ? this.currentRecipientProfile.address1
            : '',

          address2: this.currentRecipientProfile.address2
            ? this.currentRecipientProfile.address2
            : '',

          address3: this.currentRecipientProfile.address3
            ? this.currentRecipientProfile.address3
            : '',

          zip: this.currentRecipientProfile.zip
            ? this.currentRecipientProfile.zip
            : '',

          city: this.currentRecipientProfile.city
            ? this.currentRecipientProfile.city
            : '',

          state: this.currentRecipientProfile.state
            ? this.currentRecipientProfile.state
            : '',

          country: this.currentRecipientProfile.country
            ? this.currentRecipientProfile.country
            : '',

          county: this.currentRecipientProfile.county
            ? this.currentRecipientProfile.county
            : '',

          insurance:
            this.insuranceIndex > -1
              ? this.static_questionnaire_answers[this.insuranceIndex]
                .answers[0]
              : '',

          insuranceprovidername:
            this.insuranceprovidernameIndex > -1
              ? this.static_questionnaire_answers[
                this.insuranceprovidernameIndex
              ].answers[0]
              : '',

          medicalGroupNumber:
            this.medicalGroupNumberIndex > -1
              ? this.static_questionnaire_answers[this.medicalGroupNumberIndex]
                .answers[0]
              : '',

          memberId:
            this.memberIdIndex > -1
              ? this.static_questionnaire_answers[this.memberIdIndex].answers[0]
              : '',

          is_allow_private: this.currentRecipientProfile.is_allow_private,
          countryFlag: ('countryFlag' in this.currentRecipientProfile && this.currentRecipientProfile.countryFlag.hasOwnProperty('iso2')) ? this.currentRecipientProfile.countryFlag: '',
          answers: {
            ethnicgroup: this.getEthnicfunc(this.currentRecipientProfile.ethnicity),

            raceFormArray: this.patchRaceFormArrayValues(this.currentRecipientProfile.races ? this.currentRecipientProfile.races : []),

            applyAllFormArray: this.patchApplyFormArrayValues(7),

            medicalAllFormArray: this.findAnswer(12),

            prescriptionQ: this.findAnswer(8),

            allergiestomedications: this.findAnswer(9),

            otherillnesses: this.findAnswer(10),

            chronicorlongstanding: this.findAnswer(11),
          },
        };

        this.authRecipientEditForm.patchValue(req);
      },(err) => {
        this._spinner.hideLoader();
      })
    );
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
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
      this._NotificationService.showNotification(
        'Please fill the required fields.',
        'top',
        'error'
      );
      return;
    }
    /*******DISABLE SUBMIT*************/
    console.log('clicked')
    this.issubmitted = true;
    if(this.issubmitted){
      setTimeout(() => {
        this.issubmitted = false;
      }, 20000);
    }

    let formData = this.authRecipientEditForm.value;
    if (!formData.email && !formData.phoneNumber && !formData.homeno) {
      this._NotificationService.showNotification(
        'Please enter either Email / Mobile Phone Number / Home Phone Number.',
        'top',
        'error'
      );
      return false;
    }
    let races = formData.answers.raceFormArray
      .map((v, i) => (v ? this.raceList[i].value : null))
      .filter((d) => d !== null);

    let applyAllFormArray = formData.answers.applyAllFormArray
      .map((v, i) => (v ? this.applicableList[i].value : null))
      .filter((d) => d !== null);
      
      console.log(formData,'----=======')
     let ethnic =  this.getEthnicfunc(formData.answers.ethnicgroup);
    
    this.currentRecipientProfile.fname = formData.firstName;
    this.currentRecipientProfile.lname = formData.lastName;
    this.currentRecipientProfile.email = formData.email;
    let mobileNo = (this.isNew && formData.phoneNumber) ?  this.dialCode + formData.phoneNumber : this.temp + formData.phoneNumber;
    this.currentRecipientProfile.mobile_number = formData.phoneNumber;
    this.currentRecipientProfile.home_number = formData.homeno;
    this.currentRecipientProfile.dob = formData.dob
      ? this.datepipe.transform(formData.dob, 'yyyy-MM-dd')
      : this.datepipe.transform('1900-01-01', 'yyyy-MM-dd');
    this.currentRecipientProfile.gender = formData.gender;
    this.currentRecipientProfile.address1 = formData.address1;
    this.currentRecipientProfile.address2 = formData.address2;
    this.currentRecipientProfile.address3 = formData.address3;
    this.currentRecipientProfile.zip = formData.zip;
    this.currentRecipientProfile.city = formData.city;
    this.currentRecipientProfile.state = formData.state;
    this.currentRecipientProfile.country = formData.country;
    this.currentRecipientProfile.county = formData.county;
    this.currentRecipientProfile.ethnicity = ethnic;
    this.currentRecipientProfile.races = races;
    this.currentRecipientProfile.countryFlag = this.filterCountryFlag(formData.countryFlag);
    
    this.currentRecipientProfile.dob =
      moment(formData.dob).format('YYYY-MM-DD') == 'Invalid date'
        ? '1900-01-01'
        : moment(formData.dob).format('YYYY-MM-DD');
    this.is_allow_private
      ? (this.currentRecipientProfile['is_allow_private'] =
        formData.is_allow_private)
      : '';

    // if (this.insuranceIndex > -1)
    //   this.static_questionnaire_answers[this.insuranceIndex].answers[0] = formData.insurance;
    // if (this.insuranceprovidernameIndex > -1)
    //   this.static_questionnaire_answers[this.insuranceprovidernameIndex].answers[0] = formData.insuranceprovidername;
    // if (this.medicalGroupNumberIndex > -1)
    //   this.static_questionnaire_answers[this.medicalGroupNumberIndex].answers[0] = formData.medicalGroupNumber;
    // if (this.memberIdIndex > -1)
    //   this.static_questionnaire_answers[this.memberIdIndex].answers[0] = formData.memberId;

    // this.currentRecipientProfile['questionnaire_answers'] = this.static_questionnaire_answers;
    // this.currentRecipientProfile['static_questionnaire_answers'] = this.static_questionnaire_answers;
    this.currentRecipientProfile.static_questionnaire_answers = [
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
        answers: races,
      },
      {
        question_id: '12',
        question_text:
          ' Have you ever had any of the following medical conditions? - Asthama(moderate to severe) - Cancer - Cerebrovascular disease - Chronic Kidney Disease - Chronic obstructive pulmonary disease (COPD) - Cystic fibrosis - Down Syndrome - Heart conditions, such as coronary artery disease or cardiomyopathies - Hypertension or high blood pressure - Immunocompromised state (weakened immune system) - Liver disease - Neurologic conditions, (such as dementia) - Nicotine/smoking addiction - Obesity - Overweight - Pulmonary fibrosis (damaged or scarred lung tissues) - Sickle cell disease - Thalassemia (type of blood disorder) - Type 1 diabetes mellitus - Type 2 diabetes mellitus.',
        answers: [formData.answers.medicalAllFormArray],
      },
      {
        question_id: '7',
        question_text: 'Select all that apply',
        answers: applyAllFormArray,
      },
      {
        question_id: '8',
        question_text:
          'Prescription, over-the- counter medications, dietary supplements, or herbal remedies being taken at the time of Vaccination.',
        answers: [],
        // answers: [formData.answers.prescriptionQ],
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
        answers: [],
        // answers: [formData.answers.otherillnesses],
      },
      {
        question_id: '11',
        question_text: 'Chronic or long-standing health conditions prior',
        answers: [formData.answers.chronicorlongstanding],
      },
    ];

    //console.log("this.currentRecipientProfile",JSON.stringify(this.currentRecipientProfile));
    //return;
    let subscription: Observable<any>;
    if (this.recepient_only) {
      this.currentRecipientProfile.recepient_id =
        this.currentRecipientProfile.id;
      delete this.currentRecipientProfile.id;
      subscription = this._superAdminService.saveRecipientProfileOnly(
        this.currentRecipientProfile
      );
    } else if (this.isNew) { 
      subscription = this._superAdminService.saveWalkin(
        this.currentRecipientProfile
      );
    } else {
      subscription = this._superAdminService.saveRecipientProfile(
        this.currentRecipientProfile
      );
    }
    

   if(this.isNew){
     /**************** IF NEW USER *********************/
    this._siteAdminService.searchRecipients(`fname=${this.currentRecipientProfile.fname} AND lname=${this.currentRecipientProfile.lname} AND dob=${this.currentRecipientProfile.dob}`, 1, 1)
    .subscribe(({results}) => {
      const existingRecord = results[0];

      if (existingRecord) {
        const modalRef = this.modalService.open(AdminRecipientInviteFormComponent);
        modalRef.componentInstance.recipient = existingRecord;
        modalRef.componentInstance.email = this.currentRecipientProfile.email;
        modalRef.componentInstance.mobile_number = this.currentRecipientProfile.mobile_number;
        modalRef.result.then((result) => {
          this._router.navigate([this.redirectionAfterSave]);
        }, (reason) => console.log(reason));
      } else {
        this.saveWalkinUser(subscription)
      }
    }, (error) => {
      console.log("error when checking existing user.",error)
    })
   } else {
     /**************** EXISTING USER *********************/
     this.saveWalkinUser(subscription)
   }
   
  }

  saveWalkinUser(subscription){
    this.serviceSubscription.push(
      subscription.subscribe(
        (res: any) => {
          //alert(this.isFromWalkinPage)
          if (this.isFromWalkinPage == 'true') {
            if (res.status == 'success') {
              this._NotificationService.showNotification(
                'Details updated Successfully',
                'top',
                'success'
              );
              this._router.navigate([this.redirectionAfterSave]);
            } else {
              this._NotificationService.showNotification(
                'Something happened wrong. Please try again.',
                'top',
                'error'
              );
            }
          } else {
            if (res.status == 'success') {
              let rowVisitItem = JSON.parse(
                window.localStorage.getItem('receptionist-visit')
              );

              rowVisitItem.$expanded.recipient_fname =
                this.currentRecipientProfile.fname;
              rowVisitItem.$expanded.recipient_lname =
                this.currentRecipientProfile.lname;
              window.localStorage.setItem(
                'receptionist-visit',
                JSON.stringify(rowVisitItem)
              );
            }
           // console.log('isCheckedInUser : '+this.isCheckedInUser);
            if(this.isCheckedInUser){
              localStorage.setItem('isCheckedInUser','true')
              this._router.navigate([
                '/receptionist/schedule'       
              ]);
            }else{
                this._router.navigate([
                  '/receptionist/checklist',
                  this.isFromWalkinPage,
                  'start',
                ]);
            }
          }
          // this._NotificationService.showNotification('Details updated Sucessfully' , "top", 'success');
          // this._router.navigate([this.redirectionAfterSave]);
          // setTimeout(() => {
          //   this._router.navigate([this.redirectionAfterSave]);
          // }, 2000);
        },
        (err) => {
          console.log(err);
        }
      )
    );
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
    // const raceFormArray = <FormArray>(<FormGroup>this.authRecipientEditForm.controls.answers).controls.raceFormArray;
    // if (isChecked) {
    //   raceFormArray.push(new FormControl(value));
    // } else {
    //   let index = raceFormArray.controls.findIndex(x => x.value == value)
    //   raceFormArray.removeAt(index);
    // }
  }

  getCountries() {
    this.country.allCountries().subscribe(
      (data2) => {
        // this.countryInfo = data2.Countries;
        this.countryInfo = 'US';
        this.authRecipientEditForm.controls.country.setValue('US');
        var reqObj = {
          loc: 'country',
          value: 'US',
        };
        this._providerRecipientAuthService
          .allStateOnUs(reqObj)
          .subscribe((res) => {
            this.stateInfo = res.result.states;
          });
        //this.stateInfo = this.countryInfo['230'].States;
      },
      (err) => console.log(err),
      () => console.log('complete')
    );
  }
  onChangeCountry(countryValues) {
    let countryValue = countryValues.value;
  }

  onChangeState(stateValues) {
    let stateValue = stateValues.value ? stateValues.value : stateValues;
    var reqObjState = {
      loc: 'state',
      value: stateValue,
    };
    this._providerRecipientAuthService
      .allCountyState(reqObjState)
      .subscribe((res) => {
        this.countyAd = res.result.counties;
      });
  }

  onSelectAllCheckboxChange(value: string, isChecked: boolean) {
    const applyAllFormArray = <FormArray>(
      (<FormGroup>this.authRecipientEditForm.controls.answers).controls
        .applyAllFormArray
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
      this.serviceSubscription.push(
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
            this.getError();
            this._NotificationService.showNotification(
              'Enter valid zip code',
              'top',
              'error'
            );
          }
        )
      );
    } else {
      this.getError();
    }
  }
  getError() {
    this.show = false;
    this.stateshow = true;
    this.authRecipientEditForm.controls.city.setValue('');
    this.authRecipientEditForm.controls.state.setValue('');
    this.authRecipientEditForm.controls.county.setValue('');
    this.countyAd = COUNTIES;
  }
  getEthnicfunc(data){
    return  data ?this.ethnicityList.find(k => k.toLocaleLowerCase()==data.toLowerCase()):'';
  
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

  ngOnDestroy() {
    this.serviceSubscription.forEach((service) => {
      service.unsubscribe();
    });
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

  openModal1() {
    let config = {
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    };
    const dialogRef = this.dialog.open(ModalPrivacyPolicyComponent, config);
    dialogRef.afterClosed().subscribe((result) => {});
  }
  
}

function multipleCheckboxRequireOne(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden: any = control.value.indexOf(true);
    return forbidden > -1
      ? null
      : {
        multipleCheckboxRequireOne: true,
        message: 'Select atleast one checkbox.',
      };
    //return {chk: true}
  }

}
