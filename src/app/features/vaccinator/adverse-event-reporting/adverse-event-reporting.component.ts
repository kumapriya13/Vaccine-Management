import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { adverseEventCheckBox, adverseEventsNew, Hospitalization, PatientDied } from 'src/app/shared/helpers/constant';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { VaccinatorService } from '../../../core';

@Component({
  selector: 'app-adverse-event-reporting',
  templateUrl: './adverse-event-reporting.component.html',
  styleUrls: ['./adverse-event-reporting.component.scss'],
})
export class AdverseEventReportingComponent implements OnInit {
  adverseFormGroup: FormGroup;
  selectedList: any[] = [];
  adverseEventCheckBoxList: any[] = adverseEventCheckBox;
  adverseEventsQ: any[] = adverseEventsNew;
  HospitalizationQ: any[] = Hospitalization;
  PatientDied: any[] = PatientDied;
  visitId: string;
  selectedDays: any[] = [];
  fromPage: string;
  minDate: Date;
  maxDate: Date;
  dodMaxDate = new Date();
  redirectPath:string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private vaccinatorService: VaccinatorService,
    private router: Router,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {

    let minCurrentDate = new Date();
    this.minDate = minCurrentDate;

    this.buildForm();
    this.visitId = this.activatedRoute.snapshot.params['id'];
    this.fromPage = this.activatedRoute.snapshot.params['fromPage'];

    if(this.fromPage == 'card'){
      let recipientId = JSON.parse(localStorage.getItem('recipientInQRScan'))?.recipient_id;
       this.redirectPath = '/vaccinator/recipient-appointment/'+recipientId;
    }else if(this.fromPage == 'visits'){
       this.redirectPath = '/vaccinator/schedule'
    }


    this.getAdverseEnvent(this.visitId);
  }

  buildForm() {
    this.adverseFormGroup = this.fb.group({
      describeAdveseEvent: [''],
      result: [''],
      patientrecoveredInput: ['', Validators.required],
      date: ['', Validators.required],
      time: [''],
      //  clockType: [null],
      // years: ['',Validators.required],
      // months: [''],
      years: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      months: ['', [Validators.min(0), Validators.max(11)]],
      pregnantattimeofvaccination: ['', Validators.required],
      Prescriptionsoverthecountermedications: ['', Validators.required],
      Allergiestomedications: [''],
      OtherillnessesInput: [''],
      ChronicorlongInput: [''],
      resultCheckBox: this.fb.array([]),
      numberOfDays: [''],
      hospitalName: [''],
      city: [''],
      state: [''],
      dod: [''],
    });
  }

  adverseFormGroupSub() {
    const formValues = this.adverseFormGroup.value;

    if (formValues.patientrecoveredInput == '' || formValues.pregnantattimeofvaccination == '' ||
      formValues.Prescriptionsoverthecountermedications == '' || formValues.years == '' ||
      formValues.date == '') {
      this.notify.showNotification("Please answer mandatory questions", "top", 'error')
      return false;
    }

    this.constuctquestionnaire_answers(formValues);

    const adverseEventReqData = {
      visit_id: this.visitId,
      dynamic_questionnaire_answers: this.adverseEventsQ,
      static_questionnaire_answers: []
    };

    this.saveAdverseEnvent(adverseEventReqData);
  }

  setTime(field, value) {
    this[field] = moment(value, ['h:mm A']).format('HH:mm:ss');
    this.selectedDays.forEach((day) => (day.SeatDay[field] = this[field]));
  }

  constuctquestionnaire_answers(formValues: any) {
    Object.keys(formValues).forEach((x, index) => {

      if (index == 3 || index == 17) {
        let dt = this.getDateFormatted(formValues[x]);
        this.adverseEventsQ[index].QuestionnaireAnswer.answers = [dt];
      } else if (index == 12) {
        this.selectedList.forEach(element => {
          this.adverseEventsQ[12].QuestionnaireAnswer.answers.push(element);
        });
      } else {
        this.adverseEventsQ[index].QuestionnaireAnswer.answers = [formValues[x]];
      }
    });
  }

  getAdverseEnvent(visitId) {
    this.vaccinatorService.getAdverseEnvent(visitId).subscribe(
      (res) => {
        let msg = res?.message;
        if (!msg) {
          let data = res.result.AdverseEvent.dynamic_questionnaire_answers
          this.setFormData(data);
        }
      },
      (err) => {
        this.notify.showNotification('Details not found', 'bottom', 'error');
      }
    );
  }

  saveAdverseEnvent(formData) {
    this.vaccinatorService.saveAdverseEnvent(formData).subscribe(
      (res) => {
        console.log('Adverse event saved' + res);

        this.notify.showNotification("Details saved successfully.", "top", 'success');
        setTimeout(() => {
          this.adverseFormGroup.reset();
          if (this.fromPage == 'visits')
            this.router.navigate(['/vaccinator/schedule']);
          else if (this.fromPage == 'recipient')
            this.router.navigate(['/recipient/appointment']);
          else if(this.fromPage == 'card')
             this.router.navigate([this.redirectPath]);
          
        }, 2000);

      },
      (err) => {
        console.log('Adverse event saved' + err);
        this.notify.showNotification('Something went wrong', 'bottom', 'error');
      }
    );
  }

  setFormData(data) {

    this.selectedList = data[12].QuestionnaireAnswer.answers;

    this.adverseFormGroup.patchValue({
      describeAdveseEvent: data[0].QuestionnaireAnswer.answers[0],
      result: data[1].QuestionnaireAnswer.answers[0],
      patientrecoveredInput: data[2].QuestionnaireAnswer.answers[0],
      date: data[3].QuestionnaireAnswer.answers[0],
      time: data[4].QuestionnaireAnswer.answers[0],
      //  clockType: [null],
      years: data[5].QuestionnaireAnswer.answers[0],
      months: data[6].QuestionnaireAnswer.answers[0],
      pregnantattimeofvaccination: data[7].QuestionnaireAnswer.answers[0],
      Prescriptionsoverthecountermedications: data[8].QuestionnaireAnswer.answers[0],
      Allergiestomedications: data[9].QuestionnaireAnswer.answers[0],
      OtherillnessesInput: data[10].QuestionnaireAnswer.answers[0],
      ChronicorlongInput: data[11].QuestionnaireAnswer.answers[0],
      resultCheckBox: data[12].QuestionnaireAnswer.answers,
      numberOfDays: data[13].QuestionnaireAnswer.answers[0],
      hospitalName: data[14].QuestionnaireAnswer.answers[0],
      city: data[15].QuestionnaireAnswer.answers[0],
      state: data[16].QuestionnaireAnswer.answers[0],
      dod: data[17].QuestionnaireAnswer.answers[0],

    });
  }

  addSelected(obj, checked) {
    if (checked) {
      this.selectedList.push(obj);
    } else {
      this.selectedList.forEach((value, index) => {
        if (value == obj) this.selectedList.splice(index, 1);
      });
    }
  }

  getDateFormatted(dateArg: any) {
    if (dateArg == '' || dateArg == null || String(dateArg).includes('Z'))
      return '';

    let dateSelected = new Date(dateArg);
    let year = dateSelected.getFullYear();
    let month: any = dateSelected.getMonth() + 1;
    if (month < 10)
      month = '0' + month;
    let date1: any = dateSelected.getDate();
    if (date1 < 10)
      date1 = '0' + date1;
    let dt = String(year + '-' + month + '-' + date1);
    return dt;
  }

}
