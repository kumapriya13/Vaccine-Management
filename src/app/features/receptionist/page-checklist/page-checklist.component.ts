import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReceptionistService } from '../../../core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Location } from '@angular/common';
import { DeactivationGuarded } from 'src/app/core/services/route-guards/unsaved-changes.guard';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
declare var $: any;
import * as moment from 'moment';

@Component({
  selector: 'app-page-checklist',
  templateUrl: './page-checklist.component.html',
  styleUrls: ['./page-checklist.component.scss'],
})
export class PageChecklistComponent implements OnInit,DeactivationGuarded {
  dontShowDeactiavateGuard: boolean  = false;
  checkList: any[] = [];
  isCheckList: boolean = false;
  rowVisitItem: any = null;
  visitId: string;
  type: string;
  checkListForm: FormGroup;
  quesList = [
    {
      quesNo: 1,
      quesText: 'Are you feeling sick today?',
    },
    {
      quesNo: 2,
      quesText: 'Have you ever received a dose of COVID-19 vaccine?',
    },
    // {
    //   quesNo: 3,
    //   quesText: 'If yes, which vaccine product?',
    // },
    // {
    //   quesNo: 4,
    //   quesText:
    //     'Have you ever had a severe allergic reaction (e.g. anaphylaxis) to something? For example, a reaction for which you were treated with epinephrine or EpiPen or fow which you had to go to the hospital?',
    // },
    // {
    //   quesNo: 5,
    //   quesText:
    //     'Have you received passive antibody therapy (monoclonal antibodies or convalescent serum) ass treatment for COVID-19?',
    // },
    // {
    //   quesNo: 6,
    //   quesText: 'Have you received another Vaccine in the last 14 days?',
    // },
    // {
    //   quesNo: 7,
    //   quesText:
    //     'Have you had a positive test for COVID-19 or has a doctor ever told you that you had COVID- 19?',
    // },
    // {
    //   quesNo: 8,
    //   quesText:
    //     'Do you have a weakened Immune system caused by something such as HV infection or cancer or do you take immunosuppressive drugs or therapies',
    // },
    // {
    //   quesNo: 9,
    //   quesText:
    //     'Do you have a bleeding disorder or are you taking a blood thinner?',
    // },
    // {
    //   quesNo: 10,
    //   quesText: 'Are you pregnant or breastfeeding?',
    // },
  ];
  recipientVisit: any;
  selectedVisit: any = {};
  currentVisitRow: any;
  start: string;
  selectedOption: string = '';
  doseInSeries:string = '';
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private receptionistService: ReceptionistService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public _location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.visitId = this.activatedRoute.snapshot.params['id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.getCheckList(this.visitId);
  
    this.selectedVisit = JSON.parse(localStorage.getItem('receptionist-visit'));
   
    if(localStorage.getItem('qrscan')){
        this.selectedVisit = JSON.parse(localStorage.getItem('recipientInQRScan'));
        console.log('selectedVisit for QR scan '+JSON.stringify(this.selectedVisit));      
    }

    if(localStorage.getItem('doseInSeries')){
      this.doseInSeries = localStorage.getItem('doseInSeries');
      console.log('doseInSeries  '+this.doseInSeries);      
    }  
    
    this.start = localStorage.getItem('startTime');
   
  }

  identificationData() {
    //console.log(this.checkListForm.valid,this.dontShowDeactiavateGuard);
    let req = {
      id: this.visitId,
      id_validation_type: this.selectedOption==''?'Validated':this.selectedOption,
      id_validation: true,
      time_of_checkin: moment(),
    };
    // checkInVisitStatus() {
    // let reqData = {
    //   "id": this.visitId,

    // }

    this.receptionistService.checkInVisitStatus(req).subscribe(
      (res) => {
        this.dontShowDeactiavateGuard = true;
        this.router.navigate(['/receptionist/schedule']);
        // this.checkListForm.reset();
        // $("#exampleModal1").modal('show');
      },
      (err) => {
        this.checkListForm.reset();
        this.router.navigate(['/receptionist/schedule']);
      }
    );
  }

  // }
  getAnswer(value: string[]) {
    if (!!value) {
      return null;
    }
    return value;
  }

  getCheckList(visitId: string) {
    this.receptionistService.getchecklist(visitId).subscribe(
      (res) => {
        if (res) {
          this.checkList = res;
          this.isCheckList = true;
          this.checkList.forEach((ques) => {
            this.checkListForm
              .get('ques' + ques.question_id)
              .setValue(String(ques.answers));
          });
        }
      },
      (err) => alert('Something went wrong')
    );
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
      // ques10: ['', [Validators.required]],
    });
  }

  // setVisitRowToLocalStorage(visitRow: any) {
  //   this.currentVisitRow = visitRow;
  //   window.localStorage.setItem('receptionist-visit', JSON.stringify(visitRow));
  // }

  checkListFormSub() {
    if (!this.checkListForm.valid) return;
    //this.dontShowDeactiavateGuard = true;
    let formData = this.checkListForm.value;

    let reqData = {
      visitId: this.visitId,
      checklist: [
        {
          question_id: this.quesList[0].quesNo,
          question_text: this.quesList[0].quesText,
          answers: [formData.ques1],
        },
        {
          question_id: this.quesList[1].quesNo,
          question_text: this.quesList[1].quesText,
          answers: [formData.ques2],
        },
        // {
        //   question_id: this.quesList[2].quesNo,
        //   question_text: this.quesList[2].quesText,
        //   answers: [formData.ques3],
        // },
        // {
        //   question_id: this.quesList[3].quesNo,
        //   question_text: this.quesList[3].quesText,
        //   answers: [formData.ques4],
        // },
        // {
        //   question_id: this.quesList[4].quesNo,
        //   question_text: this.quesList[4].quesText,
        //   answers: [formData.ques5],
        // },
        // {
        //   question_id: this.quesList[5].quesNo,
        //   question_text: this.quesList[5].quesText,
        //   answers: [formData.ques6],
        // },
        // {
        //   question_id: this.quesList[6].quesNo,
        //   question_text: this.quesList[6].quesText,
        //   answers: [formData.ques7],
        // },
        // {
        //   question_id: this.quesList[7].quesNo,
        //   question_text: this.quesList[7].quesText,
        //   answers: [formData.ques8],
        // },
        // {
        //   question_id: this.quesList[8].quesNo,
        //   question_text: this.quesList[8].quesText,
        //   answers: [formData.ques9],
        // },
        // {
        //   question_id: this.quesList[9].quesNo,
        //   question_text: this.quesList[9].quesText,
        //   answers: [formData.ques10],
        // },
      ],
    };

    this.receptionistService.saveAnswerList(reqData).subscribe(
      (res) => {
       // this.checkInVisitStatus();
       $('#exampleModal1').modal('show');

        // this.router.navigate(['/receptionist/schedule']);
        // this.router.navigate(['/receptionist/recepient', this.visitId, this.type]);
      },
      (err) => console.log(err)
    );
  }

  checkInVisitStatus() {
    //this.dontShowDeactiavateGuard = true;
    $('#exampleModal1').modal('show');
  /*  let reqData = {
      id: this.visitId,
    };

    this.receptionistService.checkInVisitStatus(reqData).subscribe(
      (res) => {
            $('#exampleModal1').modal('show');
      },
      (err) => {
        this.checkListForm.reset();
        this.router.navigate(['/receptionist/schedule']);
      }
    );*/
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    // && (!this.checkListForm.valid && this.dontShowDeactiavateGuard)
    if((this.checkListForm.dirty && !this.dontShowDeactiavateGuard)){
      const config = {
        disableClose: true,
        data: { title: "Do you wish to exit? Please confirm.",styles: {'margin-bottom':'160px'} }
      };
      const dialogRef = this.dialog.open(ConfirmationAlertComponent, config);
      return this.exitOrNot(dialogRef.afterClosed().toPromise());
    } else {
      return true;
    }
    
    // if (confirm("Do you wish to exit. Please confirm")) {
    //   return true
    // } else {
    //   return false
    // }
  }

  async exitOrNot(dialogRef) {
    const result = await dialogRef.then((data) => data.state);
    console.log("result",result)
    return result;
 }
}
