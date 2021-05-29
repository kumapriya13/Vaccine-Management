import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { VaccinatorService } from '../../../core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
declare var $: any;
import {DeactivationGuarded } from '../../../core/services/route-guards/unsaved-changes.guard'
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-page-checklist',
  templateUrl: './page-checklist.component.html',
  styleUrls: ['./page-checklist.component.scss'],
})
export class PageChecklistComponent implements OnInit,DeactivationGuarded {
  checkList: any[] = [];
  isCheckList: boolean = false;
  rowVisitItem: any = null;
  visitId: string;
  type: string;
  checkListForm: FormGroup;
  selectedOption: string = '';
  isValidated:boolean =false;

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
  selectedVisit: any = {};
  dontShowDeactiavateGuard: boolean  = false;
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private vaccinatorService: VaccinatorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public _location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.visitId = this.activatedRoute.snapshot.params['id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.isValidated = JSON.parse(this.activatedRoute.snapshot.params['isValidated']);
    

    console.log(localStorage.getItem('vaccinator-visit'));
    this.selectedVisit = JSON.parse(localStorage.getItem('vaccinator-visit'));
    this.getCheckList(this.visitId);
    console.log(this.selectedVisit);

    if(localStorage.getItem('qrscan')){
      this.selectedVisit = JSON.parse(localStorage.getItem('recipientInQRScan'));
      console.log('selectedVisit for QR scan '+JSON.stringify(this.selectedVisit));      
    }
  }

  getAnswer(value: string[]) {
    if (!!value) {
      return null;
    }
    return value;
  }

  bindFormAgain() {
    this.checkList.forEach((ques) => {
      console.log('ques' + ques.question_id, String(ques.answers));
      this.checkListForm
        .get('ques' + ques.question_id)
        .setValue(String(ques.answers));
    });
  }

  getCheckList(visitId: string) {
    //alert(visitId);
    this.vaccinatorService.getchecklist(visitId).subscribe(
      (res) => {
        if (res) {
          this.checkList = res;
          this.isCheckList = true;
          this.checkList.forEach((ques) => {
            console.log('ques' + ques.question_id, String(ques.answers));
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
      // ques10: ['', [Validators.required]]
    });
  }

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
      ],
    };

    this.vaccinatorService.saveAnswerList(reqData).subscribe(
      (res) => {
            console.log('isValidated : '+this.isValidated)
            if(this.isValidated) {                  
                  this.checkListForm.reset();
                  this.dontShowDeactiavateGuard = true;
                  this.router.navigate(['/vaccinator/recepient',this.visitId,this.type]);
             } else{
              $('#exampleModal1').modal('show');
             } 
      },
      (err) => console.log(err)
    );
  }

  nevToNext() {
    //this.dontShowDeactiavateGuard = true;
    console.log('isValidated : '+this.isValidated)
      if(this.isValidated) {
          this.checkListForm.reset();
          this.dontShowDeactiavateGuard = true;
          this.router.navigate(['/vaccinator/recepient', this.visitId, this.type]);          
      } else{
        $('#exampleModal1').modal('show');
      }
  }

  identificationData() {
    let req = {
      id: this.visitId,
      id_validation_type: this.selectedOption==''?'Validated':this.selectedOption,
      id_validation: true,
      time_of_checkin: moment(),
    };    
    this.vaccinatorService.checkInVisitStatus(req).subscribe(
      (res) => {
        this.dontShowDeactiavateGuard = true;
        this.checkListForm.reset();
        this.router.navigate(['/vaccinator/recepient',this.visitId,this.type]);
      },
      (err) => {
           console.log('Error in checklist for vaccinator : '+err);
      }
    );
  }

  

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
      if(this.checkListForm.dirty && !this.dontShowDeactiavateGuard){
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
