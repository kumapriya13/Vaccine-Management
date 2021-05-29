import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { VaccinatorService } from 'src/app/core/services/vaccinator.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
declare var $: any;
import { DeactivationGuarded } from '../../../core/services/route-guards/unsaved-changes.guard'
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-recipient-details',
  templateUrl: './page-recipient-details.component.html',
  styleUrls: ['./page-recipient-details.component.scss'],
})
export class PageRecipientDetailsComponent implements OnInit,DeactivationGuarded {
  // Math:Math;
  selectedBatchNumber: any = null;
  siteOfAdministration: 'Right Deltoid' | 'Left Deltoid' = 'Left Deltoid';
  doseAmountAdministeredmMl: string = '0.5';
  enableBtn: boolean = true;
  currentTime: Date = new Date();
  rowVisitItem: any = null;
  isObservation: boolean = false;
  type: string;
  visitId: string;
  timeIntervalInSec: number = 15 * 60;
  displayTimeInterval = '15:00';
  counter: number = this.timeIntervalInSec;

  @ViewChild('matSelected', {static: false}) matSelected: MatSelect;
  
  _materialBatchList: any[] = [];
  //dontShowDeactiavateGuard: boolean = true;
  LotNumberForm: FormGroup;
  dontShowDeactiavateGuard: boolean = false;

  constructor(
    private vaccinatorService: VaccinatorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notify: NotificationService,
    private datepipe: DatePipe,
    public dialog: MatDialog ,
    private formBuilder: FormBuilder  
  ) {}

  changeInObservationTime(value: number) {
    //this.dontShowDeactiavateGuard = false;
    if (value == 15 * 60) {
      this.timeIntervalInSec = 15 * 60;
      this.displayTimeInterval = '15:00';
    } else if (value == 30 * 60) {
      this.timeIntervalInSec = 30 * 60;
      this.displayTimeInterval = '30:00';
    }
  }
  getValidDate(date: any) {
    let dt = date;
    console.log(dt);

    //
    if (dt == 'Invalid date' || dt == '1900-01-01') {
      dt = '-';
    } else {
      dt = this.datepipe.transform(dt, 'MM-dd-yyyy');
    }
    return dt;
  }

  patchFormValues(){

    this.LotNumberForm.patchValue({
      //batch_material_id: '',
      site_of_administration: this.siteOfAdministration,
      dose_amount_administered_ml: this.doseAmountAdministeredmMl,
      observation_end_time: this.timeIntervalInSec
    })
  }

  ngOnInit(): void { 
    
    this.LotNumberForm = this.formBuilder.group({
      batch_material_id: ['',Validators.required],
      site_of_administration: ['',Validators.required],
      dose_amount_administered_ml: ['',Validators.required],
      observation_end_time: ['',Validators.required],
    });

    

    this.visitId = this.activatedRoute.snapshot.params['id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.isObservation = this.type === 'start' ? false : true;

    if (
      this.isObservation ||
      window.localStorage.getItem('vaccinator-visit-' + this.visitId) != null
    ) {
      this.isObservation = true;
      this.enableBtn = false;    

      this.rowVisitItem = JSON.parse(
        window.localStorage.getItem('vaccinator-visit-' + this.visitId)
      );

      if(localStorage.getItem('qrscan')){
          this.rowVisitItem = JSON.parse(localStorage.getItem('recipientInQRScan'));
         console.log('selectedVisit for QR scan '+JSON.stringify(this.rowVisitItem));      
       }

      let timeIntervalInSec = this.rowVisitItem
        ? this.rowVisitItem.observationVisiterInfoObj.timeIntervalInSec
        : 0;
      this.changeInObservationTime(timeIntervalInSec);

      let startDateTime = this.rowVisitItem
        ? moment(this.rowVisitItem.observationVisiterInfoObj.startTime).toISOString()
        : moment().toISOString();

      let nowDateTime = moment().toISOString();

      console.log(startDateTime, nowDateTime);

      let timeDiffInSec = moment(startDateTime).diff(nowDateTime, 's');
      this.counter = timeIntervalInSec + timeDiffInSec;
      // adding interval
      console.log(this.counter);

      // this.counter = this.rowVisitItem
      //   ? this.rowVisitItem.observationVisiterInfoObj.timeIntervalInSec
      //   : 0;

      // this.counter =
      //   (new Date(
      //     this.rowVisitItem
      //       ? this.rowVisitItem.observationVisiterInfoObj.startTime
      //       : null
      //   ).getTime() +
      //     this.timeIntervalInSec * 1000 -
      //     new Date().getTime()) /
      //   1000;

      this.startObservation();
      
    } else {
      this.rowVisitItem = JSON.parse(
        window.localStorage.getItem('vaccinator-visit')
      );
     
      if(localStorage.getItem('qrscan')){
            this.rowVisitItem = JSON.parse(localStorage.getItem('recipientInQRScan'));
            console.log('selectedVisit for QR scan '+JSON.stringify(this.rowVisitItem));      
      }

    }

    this.materialBatchList();
    if (
      this.rowVisitItem.$expanded.vaccine == 'Moderna' ||
      this.rowVisitItem.$expanded.vaccine == 'Janssen'
    ) {
      this.doseAmountAdministeredmMl = '0.5';
    } else {
      this.doseAmountAdministeredmMl = '0.3';
    }
    this.patchFormValues()
  }

  materialBatchList() {
    let reqData = {
      q:
        'material_id=' +
        (this.rowVisitItem != null ? this.rowVisitItem['material_id'] : '') +' AND status=Enable' ,
    };
    this.vaccinatorService.getMaterialList(reqData).subscribe(
      (res) => {
        this._materialBatchList = res.batch_numbers;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onProceed() {
    let startTime = new Date();
    let endTime = moment(startTime).add(this.LotNumberForm.value.observation_end_time, 's').toDate();

    let reqObj = {
      id: this.visitId,
      batch_material_id: this.LotNumberForm.value.batch_material_id.id,
      route_of_administration: 'Intramuscular',
      site_of_administration: this.LotNumberForm.value.site_of_administration,
      dose_amount_administered_ml: this.LotNumberForm.value.dose_amount_administered_ml,
      vaccinator: '',
      time_of_administration: moment(startTime).toISOString(),
      observation_end_time: moment(endTime).toISOString(),
    };

    console.log("reqObj",JSON.stringify(reqObj));
    
    //console.log("this.LotNumberForm.dirty",this.LotNumberForm.dirty)
    // return;
    this.vaccinatorService.visitUpdateAdminstrationDetails(reqObj).subscribe(
      (res) => {
        console.log(res);
        this.isObservation = true;
        this.counter = this.LotNumberForm.value.observation_end_time;

        let visitObj = {
          ...this.rowVisitItem,
          observationVisiterInfoObj: {
            id: this.visitId,
            startTime: new Date(),
            timeIntervalInSec: this.LotNumberForm.value.observation_end_time,
          },
        };

        window.localStorage.setItem(
          'vaccinator-visit-' + this.visitId,
          JSON.stringify(visitObj)
        );
        this.LotNumberForm.reset();
        this.startObservation();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // onComplete() {
  //   this.vaccinatorService.compelte().subscribe(
  //     (res) => {
  //       if ((res.status = 'sucess')) {
  //         this.notify.showNotification(
  //           'Vaccine Dosage Completed successfully',
  //           'top',
  //           'success'
  //         );
  //         this.router.navigate(['/vaccinator/schedule']);
  //       }
  //     },
  //     (err) => {
  //       this.notify.showNotification('Something went wrong', 'bottom', 'error');
  //     }
  //   );
  // }

  onObservation() {
    // this.vaccinatorService.Observation(this.visitId).subscribe(
    //   (res) => {
    //     if ((res.status = 'sucess')) {
    //       let visitObj = {
    //         ...this.rowVisitItem,
    //         observationVisiterInfoObj: {
    //           id: this.visitId,
    //           startTime: new Date(),
    //           timeIntervalInSec: this.timeIntervalInSec,
    //         },
    //       };
    //       window.localStorage.setItem(
    //         'vaccinator-visit-' + this.visitId,
    //         JSON.stringify(visitObj)
    //       );
    //       let batchObj = {
    //         id: this.visitId,
    //         batch_no: this.selectedBatchNumber!='__other__'?this.selectedBatchNumber:this.selectedBatchNumber__other__,
    //       };
    //       this.vaccinatorService.allocateBatch(batchObj).subscribe((res) => {
    //         this.isObservation = true;
    //         this.counter = visitObj.observationVisiterInfoObj.timeIntervalInSec;
    //         this.startObservation();
    //       });
    //     }
    //   },
    //   (err) => {
    //     this.notify.showNotification('Something went wrong', 'bottom', 'error');
    //   }
    // );
  }

  startObservation() {
    //this.LotNumberForm.reset()
    console.log("this.LotNumberForm.dirty",this.LotNumberForm.dirty)
    this.counter = this.counter > 0 ? this.counter : 0;
    const timeinterval = setInterval(() => {
      let mint = Math.floor(this.counter / 60).toFixed(0);
      let sec = (this.counter - Math.floor(this.counter / 60) * 60).toFixed(0);
      this.displayTimeInterval =
        (mint.length == 1 ? '0' + mint : mint) +
        ':' +
        (sec.length == 1 ? '0' + sec : sec);

      if (this.counter <= 0) {
        this.counter = 0;
        this.enableBtn = false;
        this.displayTimeInterval = '00:00';
        clearTimeout(timeinterval);
      } else {
        this.counter--;
      }
    }, 1000);
  }


selectColor(event) {
    if(event.value?.material_color){
      //this.dontShowDeactiavateGuard = false;
         let selectedColor = event.value?.material_color;    
        let ref = this.matSelected.trigger.nativeElement.querySelector(".mat-select-value");
        ref.setAttribute('style', 'color:'+selectedColor); 
      }
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if(this.LotNumberForm.dirty){
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
