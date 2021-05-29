import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { RecipientService, UserService } from '../../../../../core';

@Component({
  selector: 'app-page-vaccine-schedule',
  templateUrl: './page-vaccine-schedule.component.html',
  styleUrls: ['./page-vaccine-schedule.component.scss']
})
export class PageVaccineScheduleComponent implements OnInit {
  qrImageBase64: string = '';
  @Output('cancleAppointment') _cancleAppointment: EventEmitter<any> = new EventEmitter<any>();
  @Input('myStepper') myStepper: MatStepper = null;
  @Input('recipientVisit') _recipientVisit: any = {};
  @Input() set recipientVisit(value: any[]) {
    this._recipientVisit = this.userService.getRecipientVisitsTolocalStorageInDescendingByCreatedTime();
    let results = this._recipientVisit['results'];
    results.forEach(element => {
         if(element.visit_status=='completed')
              this._recipientService.vaccinationDate = element?.start_time;
    });
    console.log('Vaccination Start Date : '+this._recipientService.vaccinationDate);   
  }
  get recipientVisit(): any[] {
    return this._recipientVisit;
  }

  constructor(private userService: UserService, private _recipientService: RecipientService ) { }

  ngOnInit(): void {
    this.recipientQRCode();
    
  }

  bookNextAppointment() {
    this.myStepper.selectedIndex = 0;
    localStorage.setItem('stepperNo', JSON.stringify(0));
  }

  viewCertificate() {
    this.myStepper.selectedIndex = 3;
    localStorage.setItem('stepperNo', JSON.stringify(3));
  }

  cancleAppointment(recipientVisitItem) {
    this._cancleAppointment.emit(recipientVisitItem);
  }

  recipientQRCode() {
    let reqData = {
      "$comment": "Find the render options here: https://www.npmjs.com/package/qrcode#renderers-options",
      "options": {
      }
    }
    this.userService.recipientQRCode(reqData).subscribe(res => {
      this.qrImageBase64 = res.code;
    }, err => {
      console.log(err);
    });
  }

  checkCertificateVisible(): boolean {
    if (this._recipientVisit['results'].length > 0) {
      let no_of_doses_in_series = this._recipientVisit['results'][0].$expanded.no_of_doses_in_series;
      if (this._recipientVisit['results'].length == no_of_doses_in_series) {
        return this.recipientVisit['results'][0][
          'visit_status'
        ] == 'completed' &&  this.recipientVisit['results'][0][
          'dose_in_series'
        ]== no_of_doses_in_series
          ? true
          : false;
      
      }
    }
    return false;
  }
}
