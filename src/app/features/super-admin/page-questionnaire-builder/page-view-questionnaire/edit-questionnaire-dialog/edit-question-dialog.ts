import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SuperAdminService } from '../../../../../core/services/super-admin.service';

@Component({
  selector: 'edit-question-dialog',
  templateUrl: './edit-question-dialog.html',
  styleUrls: ['edit-question-dialog.scss']
})

export class EditQuestionDialog implements OnInit {
  options: any[] = [];
  rules: any[] = [];
  currentQuestion: any;
  answerType:string;
   
  selected_answer_min:any;
  selected_gui_control:any;
  //_types: any = [];
   _qAnswers: any = [];

  constructor(
    public dialogRef: MatDialogRef<EditQuestionDialog>,
    private service: SuperAdminService,
    private _notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    console.log('data', data)
  }

  ngOnInit(): void {
    this.currentQuestion = this.data.questionnaire.dynamic_questionnaire_answers[this.data.index].QuestionnaireAnswer;
    this.options = this.data.questionnaire.dynamic_questionnaire_answers[this.data.index].QuestionnaireAnswer.options;
    this.rules = this.data.questionnaire.classification_rules;
    console.log('currentQuestion obj = ', this.currentQuestion);
    
    this._qAnswers = this.data.questionnaire.dynamic_questionnaire_answers[this.data.index].QuestionnaireAnswer.options;
  /*   this.data.questionnaire.classification_rules.forEach(element => {
      this._types.push(element.event.type);
    });
    console.log('Init _qAnswers '+this._qAnswers+', _types : '+this._types);
   */ 
 }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getRuleIndex(value) {
    const qid = this.currentQuestion.question_id;
    return this.rules.findIndex((rule) => rule.conditions.all[0].value === qid && rule.conditions.all[1].value === value);
  }

  addAnswer() {
    this.options.push("");
  }

  deleteAnswer(index, value) {
    this.options.splice(index, 1);
    const ruleIndex = this.getRuleIndex(value);
    if (ruleIndex !== -1) {
      this.rules.splice(ruleIndex, 1);
    }
  }

  saveAnswer(index, value) {
    this.options[index] = value;
    const ruleIndex = this.getRuleIndex(value);
    if (ruleIndex === -1) {
      this.rules.push({
        conditions: {
          all: [
            { fact: "question_id", operator: "equal", value: this.currentQuestion.question_id },
            { fact: "answers", operator: "contains", value: value }
          ]
        },
        event: {
          type: ""
        }
      });
    } else {
      this.rules[ruleIndex].conditions.all[1].value = value;
    }

     this._qAnswers.splice(index, 1, value);
    //console.log('_qAnswers : '+this._qAnswers);
  }

  getClassification(option) {
    const ruleIndex = this.getRuleIndex(option);
    if (ruleIndex !== -1) {
     // this._types.push(this.rules[ruleIndex].event.type);
      return this.rules[ruleIndex].event.type;
    }
    
  }

  saveClassification(index,option, rule) {
    const ruleIndex = this.getRuleIndex(option);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex].event = {
        type: rule
      };
    }

    //this._types.splice(index, 1, rule);
   // console.log('this.types : ' + this._types)
  }

  saveField(field, value) {
    if (field == 'answer_min') {
      this.currentQuestion[field] = parseInt(value);
    }
    else
      this.currentQuestion[field] = value;

    
  }

  saveQuestion() {   
    console.log('answerType ..'+this.answerType);
    let isValidData = true;

     this.data.questionnaire.dynamic_questionnaire_answers.forEach(element => {
      element.QuestionnaireAnswer.options.forEach(option => {
        if (option.trim() == "") {
          this._notificationService.showNotification('Enter answer text', 'top', 'error');
          isValidData = false;
          return false;
        }       
      });

      if (element.QuestionnaireAnswer.question_text.trim() == "") {
        this._notificationService.showNotification('Enter question text', 'top', 'error');
        isValidData = false;
        return false;
      }
    });

    this.data.questionnaire.classification_rules.forEach(element => {
      if (element.event.type == "") {
        this._notificationService.showNotification('Select classification type', 'top', 'error');
        isValidData = false;
        return false;
      }
    });

   // this._types = [];this._qAnswers = [];
    if (isValidData) {
      this.data.questionnaire.language = 'english';
      this.service.saveQuestionnaire(this.data.questionnaire).subscribe((results) => {          
        this._notificationService.showNotification('Data saved successfully.', 'top', 'success');
          setTimeout(() => {
            console.log('Update Questionnaire', results),         
            this.dialogRef.close();         
           }, 1000);       

      },(err) =>{
          console.error('Error '+err);
      })
    }
  }

}