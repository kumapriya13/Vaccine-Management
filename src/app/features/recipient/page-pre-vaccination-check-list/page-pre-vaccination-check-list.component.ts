import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../core';
import * as moment from 'moment';

@Component({
  selector: 'app-page-pre-vaccination-check-list',
  templateUrl: './page-pre-vaccination-check-list.component.html',
  styleUrls: ['./page-pre-vaccination-check-list.component.scss']
})
export class PagePreVaccinationCheckListComponent implements OnInit {
  checkListForm: FormGroup;
  quesList = [
    {
      quesNo: 1,
      quesText: "Are you feeling sick today?"
    },
    {
      quesNo: 2,
      quesText: "Have you ever received a dose of COVID-19 vaccine?"
    },
    // {
    //   quesNo: 3,
    //   quesText: "If yes, which vaccine product?"
    // },
    // {
    //   quesNo: 4,
    //   quesText: "Have you ever had a severe allergic reaction (e.g. anaphylaxis) to something? For example, a reaction for which you were treated with epinephrine or EpiPen or fow which you had to go to the hospital?"
    // },
    // {
    //   quesNo: 5,
    //   quesText: "Have you received passive antibody therapy (monoclonal antibodies or convalescent serum) ass treatment for COVID-19?"
    // },
    // {
    //   quesNo: 6,
    //   quesText: "Have you received another Vaccine in the last 14 days?"
    // },
    // {
    //   quesNo: 7,
    //   quesText: "Have you had a positive test for COVID-19 or has a doctor ever told you that you had COVID- 19?"
    // },
    // {
    //   quesNo: 8,
    //   quesText: "Do you have a weakened Immune system caused by something such as HV infection or cancer or do you take immunosuppressive drugs or therapies"
    // },
    // {
    //   quesNo: 9,
    //   quesText: "Do you have a bleeding disorder or are you taking a blood thinner?"
    // },
    // {
    //   quesNo: 10,
    //   quesText: "Are you pregnant or breastfeeding?"
    // }
  ];
  recipientVisit: any;

  constructor(
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _location: Location
  ) { }
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
    this.buildForm();
    this.recipientVisit = this._userService.getRecipientVisitsTolocalStorageInDescendingByCreatedTime();
    if (this.recipientVisit.results.length > 0) {
      // load data and buikd the data
    }
  }

  buildForm() {
    this.checkListForm = this.formBuilder.group({
      ques1: ['', [Validators.required]],
      ques2: ['', [Validators.required]],
      // ques3: ['', []],
      // ques4: ['', [Validators.required]],
      // ques5: ['', [Validators.required]],
      // ques6: ['', [Validators.required]],
      // ques7: ['', [Validators.required]],
      // ques8: ['', [Validators.required]],
      // ques9: ['', [Validators.required]],
      // ques10: ['', [Validators.required]]
    });
  }

  checkListFormSub() {
    let formData = this.checkListForm.value;

    let reqData = {
      "visitId": this.recipientVisit.results[0].id || "",
      "checklist": [
        {
          "question_id": this.quesList[0].quesNo,
          "question_text": this.quesList[0].quesText,
          "answers": [
            formData.ques1
          ]
        },
        {
          "question_id": this.quesList[1].quesNo,
          "question_text": this.quesList[1].quesText,
          "answers": [
            formData.ques2
          ]
        },
        // {
        //   "question_id": this.quesList[2].quesNo,
        //   "question_text": this.quesList[2].quesText,
        //   "answers": [
        //     formData.ques3
        //   ]
        // },
        // {
        //   "question_id": this.quesList[3].quesNo,
        //   "question_text": this.quesList[3].quesText,
        //   "answers": [
        //     formData.ques4
        //   ]
        // },
        // {
        //   "question_id": this.quesList[4].quesNo,
        //   "question_text": this.quesList[4].quesText,
        //   "answers": [
        //     formData.ques5
        //   ]
        // },
        // {
        //   "question_id": this.quesList[5].quesNo,
        //   "question_text": this.quesList[5].quesText,
        //   "answers": [
        //     formData.ques6
        //   ]
        // },
        // {
        //   "question_id": this.quesList[6].quesNo,
        //   "question_text": this.quesList[6].quesText,
        //   "answers": [
        //     formData.ques7
        //   ]
        // },
        // {
        //   "question_id": this.quesList[7].quesNo,
        //   "question_text": this.quesList[7].quesText,
        //   "answers": [
        //     formData.ques8
        //   ]
        // },
        // {
        //   "question_id": this.quesList[8].quesNo,
        //   "question_text": this.quesList[8].quesText,
        //   "answers": [
        //     formData.ques9
        //   ]
        // },
        // {
        //   "question_id": this.quesList[9].quesNo,
        //   "question_text": this.quesList[9].quesText,
        //   "answers": [
        //     formData.ques10
        //   ]
        // }
      ]
    }

    this._userService.saveVisitChecklist(reqData).subscribe(
      res => {
        console.log(res);
        this.checkInVisitStatus();
      },
      err => {
        console.log(err);
      }
    );
  }

  checkInVisitStatus() {
    let reqData = {
      "id": this.recipientVisit.results[0].id || "",
      time_of_checkin: moment(),
    }

    this._userService.checkInVisitStatus(reqData).subscribe(
      res => {
        console.log(res);
        this.reLoadRecipientVisits();
      },
      err => {

      }
    );
  }

  reLoadRecipientVisits() {
    this._userService.getRecipientVisits().subscribe(
      res => {
        this.recipientVisit = res;
        this._userService.setRecipientVisitsTolocalStorage(res);
        this.checkListForm.reset();
        this._router.navigate(['/recipient/appointment']);
      },
      err => { }
    );
  }
}
