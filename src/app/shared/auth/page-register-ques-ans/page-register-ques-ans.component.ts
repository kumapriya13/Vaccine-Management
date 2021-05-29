import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RecipientAuthService } from '../../../core';
import { NotificationService } from '../../services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-page-register-ques-ans',
  templateUrl: './page-register-ques-ans.component.html',
  styleUrls: ['./page-register-ques-ans.component.scss']
})
export class PageRegisterQuesAnsComponent implements OnInit {

  instructionText:string;

  classificationRules:any=[];
  qaFormGroup: any;
  qaList: any = [];
  formData: any;
  state: string;
  county: string;
  responseFlag: boolean = false;
  questionIdSetNumber:string='';

  constructor(private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private _NotificationService: NotificationService,
    private route: ActivatedRoute,
    public datepipe: DatePipe) { }   


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.state = params.state;
      this.county = params.county;
      this.formData = params.formData;
      console.log('PageRegisterQuesAnsComponent : State:' + this.state + ', county:' + this.county);    
    });

    this.getDynamicQuestions(this.state, this.county.toLocaleLowerCase());
    this.qaFormGroup = this.fb.group({
      qaFormArray: this.fb.array([])
    })
    this.formData = localStorage.getItem('tempRegistringUser');
    // localStorage.removeItem('tempRegistringUser');
  }

  loadData() {   
    for (let x of this.qaList) {
      this.qaFormGroup.get('qaFormArray').push(
        this.fb.group({
          question_id: new FormControl(x.QuestionnaireAnswer.question_id),
          question_text: new FormControl(x.QuestionnaireAnswer.question_text),
          options: new FormArray(this.loadOptions(x.QuestionnaireAnswer.options)),
          answers: new FormArray(this.loadOptions(x.QuestionnaireAnswer.answers)),
          answer_min: new FormControl(x.QuestionnaireAnswer.answer_min),
          answer_max: new FormControl(x.QuestionnaireAnswer.answer_max),
          gui_control: new FormControl(x.QuestionnaireAnswer.gui_control)
        }))
    }
  }

  loadOptions(x): any {
    let controls = [];
    for (let y of x) {
      controls.push(new FormControl(y, Validators.required));
    }
    return controls;
  }


  submit(f) {   
    for (let ele of this.qaList) {    
      if (ele.QuestionnaireAnswer.question_text.includes('*') 
          && ele.QuestionnaireAnswer.answers.length == 0) {
        this._NotificationService.showNotification("Please answer mandatory questions.", "top", 'error')
        return false;
      }
    }
    this.formData = JSON.parse(this.formData);
    this.formData["dynamic_questionnaire_answers"] = this.qaList;
    this.formData["dynamic_questionnaire_id"] = this.questionIdSetNumber;
          
    console.log("JSON FormData : " + JSON.stringify(this.formData))
    this.saveDynamicQuestions(this.formData);
  }


  addVal(indx, ref) {
    let answer = ref.value;
    if (ref.type == 'radio') {
      let answers = [];
      answers.push(ref.value);
      this.qaList[indx].QuestionnaireAnswer.answers = answers;
    } else if (ref.type == 'checkbox') {
      let answers = this.qaList[indx].QuestionnaireAnswer.answers;
      if (ref.checked == true) {
        answers.push(answer);
      } else {
        const index = answers.indexOf(ref.value, 0);
        if (index > -1) {
          answers.splice(index, 1);
        }
      }
      this.qaList[indx].QuestionnaireAnswer.answers = answers;
    } else if (ref.type == "text") {
      let answers = [];
      answers.push(ref.value);
      this.qaList[indx].QuestionnaireAnswer.answers = answers;
    }
  }


  getDynamicQuestions(state: string, county: string) {
    let reqObj = {
      "criteria": {
        "country": "United States of America",
        "state": [state],
        "language": "english",
        "county": county
      },
      "page": 1,
      "pageLength": 10,
      "sort": ""
    }

    this._providerRecipientAuthService.getDynamicQuestions(reqObj).subscribe(
      res => {        
        this.questionIdSetNumber = res.results[0].id;
        this.instructionText = res.results[0].instructions;
        this.responseFlag = true;
        this.qaList = res.results[0].dynamic_questionnaire_answers;   
        this.loadData();
      },
      err => {
        this.responseFlag = true;
        console.log('getDynamicQuestions:' + err);
      }
    );
  }

  saveDynamicQuestions(formData: any) {
    this._providerRecipientAuthService.recipientSignUp(formData).subscribe(
      res => {
        localStorage.removeItem('recipient-preview');
        localStorage.removeItem('tempRegistringUser');
        // this.authRecipientSignUpForm.reset();
        this._router.navigate(['/auth/verify-otp']);
      },
      err => {
        console.log('Error : ' + err);
        if (err.error.text == "") {
          this._NotificationService.showNotification("Something went wrong", "top", 'error')
        }
        this._NotificationService.showNotification(err.error.text, "top", 'error')
      }
    );
  }
}
