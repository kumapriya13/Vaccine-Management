import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'question-builder-block',
  templateUrl: './question-builder-block.component.html',
  styleUrls: ['./question-builder-block.component.scss']
})
export class QuestionBuilderBlockComponent implements OnInit {

  qType: string;
  aType: string;
  _types: any = [];
  _qAnswers: any = [];

  @Input() questions: any;
  @Input() rules: any;

  question_id = 1;
  currentQuestion = {
    QuestionnaireAnswer: {
      question_id: this.question_id.toString(),
      question_text: '',
      gui_control: '',
      options: [],
      answers: [],
      answer_max: 1,
      answer_min: ''
    }
  };
  options = [];

  constructor(private _notificationService: NotificationService) { }

  ngOnInit(): void { }

  saveField(field, value) {
    if (field == 'answer_min') {
      this.currentQuestion.QuestionnaireAnswer[field] = parseInt(value);
    } else
      this.currentQuestion.QuestionnaireAnswer[field] = value;
  }

  addAnswer() {
    this.options.push({ count: this._qAnswers.length + 1 });
  }

  deleteAnswer(index) {
    this.currentQuestion.QuestionnaireAnswer.options.splice(index, 1);
    this.rules.splice(index, 1);
    this.options.splice(index, 1);
  }

  saveAnswer(index, value) {
    console.log('index : '+index);
    console.log('B this._qAnswers : '+this._qAnswers);
    this._qAnswers.splice(index, 1, value);
    console.log('A this._qAnswers : '+this._qAnswers);
  }

  saveClassification(index, rule) {
    this._types.splice(index, 1, rule);
    console.log('this.types : ' + this._types)
  }


  deleteQuestion(index) {
    this.questions.splice(index, 1);
  }


  saveQuestion() {

    this._qAnswers.forEach((element,index) => {
      //classification
      let obj = {
        conditions: {
          all: [
            { fact: "question_id", operator: "equal", value: this.question_id.toString() },
            { fact: "answers", operator: "contains", value: element }
          ]
        }
      }

      obj["event"] = {
        type: this._types[index]
      };

      this.rules.push(obj);
      //answers.
      this.currentQuestion.QuestionnaireAnswer.options.push(element);


    });

    this._types = [];
    this._qAnswers = [];
    let isValidData = true;

    if (this.currentQuestion?.QuestionnaireAnswer?.question_text.trim() == '') {
      this._notificationService.showNotification('Enter question text', 'top', 'error');
      isValidData = false;
      return false;
    }
    if (this.currentQuestion?.QuestionnaireAnswer?.options.length == 0) {
      this._notificationService.showNotification('Enter answers text', 'top', 'error');
      isValidData = false;
      return false;
    }
    this.rules.forEach(element => {
      if (element.event.type == "") {
        this._notificationService.showNotification('Select classification type', 'top', 'error');
        isValidData = false;
        return false;
      }
    });

    if (isValidData) {
      this.questions.push(this.currentQuestion);
      this.question_id++;
      document.querySelector('#question').innerHTML = '';
      this.currentQuestion = {
        QuestionnaireAnswer: {
          question_id: this.question_id.toString(),
          question_text: '',
          gui_control: '',
          options: [],
          answers: [],
          answer_max: 1,
          answer_min: ''
        }
      };
      this.options = [];
    }
  }
}
