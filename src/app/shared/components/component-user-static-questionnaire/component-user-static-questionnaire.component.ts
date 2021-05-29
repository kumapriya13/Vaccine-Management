import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { applicableList, raceList, STATIC_QUESTIONNAIRE, medicalList, ETHNICITY_LIST } from '../../helpers/constant';

@Component({
  selector: 'component-user-static-questionnaire',
  templateUrl: './component-user-static-questionnaire.component.html',
  styleUrls: ['./component-user-static-questionnaire.component.scss'],
})
export class ComponentUserStaticQuestionnaireComponent implements OnInit {
  @Input() questionnaire: any[];
  @Input() getallvalue: any;
  raceList = raceList;
  applicableList = applicableList;

  ethnicity: string;
  prescriptionQ: string;
  allergiesStatus: string;
  otherIllness: string;
  chronicOrLongStandingHealthCondition: string;
  insurance: string;
  insuranceProvider: string;
  medicalGroupNumber: string;
  medicalId: string;

  raceSelectionInfo: { [key: string]: boolean } = {};
  employeeStatusSelectionInfo: { [key: string]: boolean } = {};
  medicalList: any[] = medicalList;
  medicalValue: any = [];
  questionValidation = {
    q1: false,
    q2: false
  }
  checkedValue = []
  constructor() { }

  get races(): string[] {
    return Object.keys(this.raceSelectionInfo).filter((race) => !!this.raceSelectionInfo[race]);
  }

  set races(values: string[]) {
    values.forEach((value) => (this.raceSelectionInfo[value] = true));
  }

  get employeeStatus(): string[] {
    return Object.keys(this.employeeStatusSelectionInfo).filter((status) => !!this.employeeStatusSelectionInfo[status]);
  }

  set employeeStatus(values: string[]) {
    values.forEach((value) => (this.employeeStatusSelectionInfo[value] = true));
  }

  ngOnInit(): void {
    this.questionnaire && this.setAnswers(this.questionnaire);
    this.ethnicity = this.getEthnicfunc(this.getallvalue.ethnicity);
    this.races = this.getRacesFunc(this.getallvalue.races);
  }

  getEthnicfunc(data) {
    return data ? ETHNICITY_LIST.find(k => k.toLocaleLowerCase() == data.toLowerCase()) : '';

  }
  getRacesFunc(data){

    let result =[]
    for(let i of data){
      for(let j of this.raceList){

        if(i.toLowerCase() == j.value.toLowerCase()){
            result.push(j.value)
        }
      }
    }
    this.checkedValue = result;
    return result
  }
  getethnicityValue(data) {
    this.questionValidation['q1'] = data ? false : true
  }
  checkUncheckAll(event, data) {
    if (event.target.checked) {
      this.checkedValue.push(data)
    } else {
      let itemToBeRemoved = [data]
      this.checkedValue = this.checkedValue.filter(item => !itemToBeRemoved.includes(item))
    }
    this.questionValidation['q2'] = this.checkedValue.length ? false : true;
  }
  setAnswers(questionnaire: any[]): void {
    questionnaire.forEach((question) => {
      delete question.answer_options;
      const answers = question.answers;
      if (answers?.length > 0) {
        switch (question.question_id) {
          case '1':
            this.ethnicity = this.getallvalue.ethnicity ? this.getallvalue.ethnicity : question.answers[0];
            break;
          case '2':
            let value = this.getallvalue.races && this.getallvalue.races.length ? this.getallvalue.races : answers;
            this.races = value;
            this.checkedValue = value
            break;
          case '3':
            this.medicalGroupNumber = answers[0];
            break;
          case '4':
            this.medicalId = answers[0];
            break;
          case '5':
            this.insurance = answers[0];
            break;
          case '6':
            this.insuranceProvider = answers[0];
            break;
          case '7':
            this.employeeStatus = answers;
            break;
          case '8':
            this.prescriptionQ = answers[0];
            break;
          case '9':
            this.allergiesStatus = answers[0];
            break;
          case '10':
            this.otherIllness = answers[0];
            break;
          case '11':
            this.chronicOrLongStandingHealthCondition = answers[0];
            break;
          case '12':
            this.medicalValue = answers[0];
            break;
        }
      }
    });
  }

  getAnswers(): any[] {
    const questionnaire: any[] = _.cloneDeep(STATIC_QUESTIONNAIRE);
    questionnaire.forEach((question) => {
      delete question.answer_options;
      switch (question.question_id) {
        case '1':
          question.answers = this.ethnicity ? [this.ethnicity] : [];
          question.validation = this.ethnicity ? false : true
          this.questionValidation['q1'] = question.validation
          break;
        case '2':
          question.answers = this.races;
          question.validation = this.races.length ? false : true
          this.questionValidation['q2'] = question.validation
          break;
        case '3':
          question.answers = this.medicalGroupNumber ? [this.medicalGroupNumber] : [];
          break;
        case '4':
          question.answers = this.medicalId ? [this.medicalId] : [];
          break;
        case '5':
          question.answers = this.insurance ? [this.insurance] : [];
          break;
        case '6':
          question.answers = this.insuranceProvider ? [this.insuranceProvider] : [];
          break;
        case '7':
          question.answers = this.employeeStatus;
          break;
        case '8':
          question.answers = this.prescriptionQ ? [this.prescriptionQ] : [];
          break;
        case '9':
          question.answers = this.allergiesStatus ? [this.allergiesStatus] : [];
          break;
        case '10':
          question.answers = this.otherIllness ? [this.otherIllness] : [];
          break;
        case '11':
          question.answers = this.chronicOrLongStandingHealthCondition
            ? [this.chronicOrLongStandingHealthCondition]
            : [];
          break;
        case '12':
          question.answers = this.medicalValue
          break;
      }
    });
    // console.log(questionnaire,'-----')

    return questionnaire;
  }
  onSelectMedicalListChange(value: string, isChecked: boolean) {
    const medicalAllFormArray: any = []
    if (isChecked) {
      medicalAllFormArray.push(value);
    } else {
      let index = medicalAllFormArray.findIndex(
        (x) => x.value == value
      );
      medicalAllFormArray.removeAt(index);
    }
    this.medicalValue = medicalAllFormArray;
  }
}
