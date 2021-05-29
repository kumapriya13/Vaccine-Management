import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { ReceptionistService } from '../../../core';

@Component({
  selector: 'app-page-recipient-details',
  templateUrl: './page-recipient-details.component.html',
  styleUrls: ['./page-recipient-details.component.scss'],
})
export class PageRecipientDetailsComponent implements OnInit {
  // Math:Math;
  selectedBatchNumber: any = null;
  siteOfAdministration: 'Right Deltoid' | 'Left Deltoid' = 'Right Deltoid';
  doseAmountAdministeredmMl: string = '0.5';
  enableBtn: boolean = true;
  currentTime: Date = new Date();
  rowVisitItem: any = null;
  isObservation: boolean = false;
  type: string;
  visitId: string;
  timeIntervalInSec: number = 5;
  displayTimeInterval = '00:05';
  counter: number = this.timeIntervalInSec;
  _materialBatchList: any[] = [];

  constructor(
    private receptionistService: ReceptionistService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.visitId = this.activatedRoute.snapshot.params['id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.isObservation = this.type === 'start' ? false : true;

    if (
      this.isObservation ||
      window.localStorage.getItem('receptionist-visit-' + this.visitId) != null
    ) {
      this.isObservation = true;
      this.enableBtn = false;
      this.rowVisitItem = JSON.parse(
        window.localStorage.getItem('receptionist-visit-' + this.visitId)
      );
      this.counter = this.rowVisitItem
        ? this.rowVisitItem.observationVisiterInfoObj.timeIntervalInSec
        : 0;

      this.counter =
        (new Date(
          (this.rowVisitItem ? this.rowVisitItem.observationVisiterInfoObj.startTime:null)
        ).getTime() +
          this.timeIntervalInSec * 1000 -
          new Date().getTime()) /
        1000;
      this.startObservation();
    } else {
      this.rowVisitItem = JSON.parse(
        window.localStorage.getItem('receptionist-visit')
      );
    }

    this.materialBatchList();
  }

  materialBatchList() {
    this.receptionistService.getMaterialList().subscribe(
      (res) => {
        this._materialBatchList = res.results;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onProceed() {
    let startTime = new Date();
    let endTime = moment(startTime).add(5, 's').toDate();

    let reqObj = {
      id: this.visitId,
      batch_material_id: this.selectedBatchNumber.id,
      route_of_administration: 'Intramuscular',
      site_of_administration: this.siteOfAdministration,
      dose_amount_administered_ml: this.doseAmountAdministeredmMl,
      receptionist: '',
      time_of_administration: startTime.toISOString(),
      observation_end_time: endTime.toISOString(),
    };

    this.receptionistService.visitUpdateAdminstrationDetails(reqObj).subscribe(
      (res) => {
        console.log(res);
        this.isObservation = true;
        this.counter = this.timeIntervalInSec;

        let visitObj = {
          ...this.rowVisitItem,
          observationVisiterInfoObj: {
            id: this.visitId,
            startTime: new Date(),
            timeIntervalInSec: this.timeIntervalInSec,
          },
        };

        window.localStorage.setItem(
          'receptionist-visit-' + this.visitId,
          JSON.stringify(visitObj)
        );

        this.startObservation();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  startObservation() {
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
}
