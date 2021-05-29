import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SuperAdminService } from '../../../../core';
import { COUNTIES } from '../../../../shared/helpers/constant';
import { US_STATES } from '../../../../shared/helpers/usStates';

@Component({
  selector: 'app-new-questionnaire',
  templateUrl: './page-new-questionnaire.component.html',
  styleUrls: ['./page-new-questionnaire.component.scss']
})
export class PageNewQuestionnaireComponent implements OnInit {
  counties = COUNTIES;
  states = US_STATES;
  statecode:any;
  instructionsText:string;

  instructions: string = "We'll ask some questions to determine when you are able to get the COVID-19 vaccine. This information will be kept private with the State of New Jersey and only used to register you to receive a COVID-19 vaccine.";
  questionnaire = {
    language: "english",
    country: "United States of America",
    state: "",
    county: "",
    instructions: "",
    dynamic_questionnaire_answers: [],
    classification_rules: []
  };

  stateSelected:string;
  countySelected:string;
 

  constructor(
    private questionService: SuperAdminService,
    private _router:Router,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  newQuestion() {
    return this.questionnaire.dynamic_questionnaire_answers[this.questionnaire.dynamic_questionnaire_answers.length - 1];
  }

  deleteQuestion(index) {
    this.questionnaire.dynamic_questionnaire_answers.splice(index, 1);
  }

  getType(i, x) {
    const question = this.questionnaire.dynamic_questionnaire_answers[i];
    console.log('Question', question);
    const rules = _.find(
      this.questionnaire.classification_rules,
      _.flow(
        _.property('conditions'),
        _.property('all'),
        _.partialRight(_.some, {
          fact: 'question_id',
          value: question.QuestionnaireAnswer.question_id
        })
      )
    );
    console.log('Found rules', rules);
  }

  saveField(field, value) {     
    if(field=='state'){
         let arr = value.split('_');
         this.statecode            = arr[0];
         this.questionnaire[field] = arr ;//arr[1]
    }else
       this.questionnaire[field] = value;

       console.log(this.questionnaire);
  }

  save() {    
    let isValidData = true;
    if(!this.stateSelected) {
        this._notificationService.showNotification('Select state', 'top', 'error');
        isValidData = false;
        return false;
    }
    if(!this.countySelected) {
      this._notificationService.showNotification('Select county', 'top', 'error');
      isValidData = false;
      return false;
    }
    if(isValidData){
        this.questionService.saveQuestionnaire(this.questionnaire).subscribe(res => {
          this._notificationService.showNotification('Data saved successfully.', 'top', 'success');
          setTimeout(() => {
            console.log(res);
            this._router.navigate(['/super-admin/questionnaire-builder']);          
        }, 1000);         
        })
    }
  }
}
