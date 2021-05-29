import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../core';

@Component({
  selector: 'app-page-appointment',
  templateUrl: './page-appointment.component.html',
  styleUrls: ['./page-appointment.component.scss']
})
export class PageAppointmentComponent implements OnInit {
  isdisplay: boolean = false;
  userInfo: any = {};
  isEligible: boolean = true;
  stepperNo = 1;

  constructor(
    private userService: UserService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('recipient-user'));

    console.log('this.userInfo', this.userInfo)
  }

  ngOnInit(): void {
    this.userService.getRecipientVisits().subscribe(
      (res: any) => {
        this.userService.setRecipientVisitsTolocalStorage(res);
        if (res.results.length > 0) {
          this.stepperNo = 2;
          localStorage.setItem('stepperNo', JSON.stringify(this.stepperNo));
          this.isdisplay = true;
        } else {
          this.stepperNo = 0;
          localStorage.setItem('stepperNo', JSON.stringify(this.stepperNo));
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.getClassificationCodes();
  }

  getClassificationCodes() {
    this.userService.getClassiCode().subscribe((results: any) => {
      console.log(results.result);
      const status = results.result.find((classy) => classy.classification === this.userInfo.classification);
      this.isEligible = status ? status.is_eligible : true;
      console.log('status', status, this.isEligible);
    });
  }

  public get exactStepNumber(): number {
    return parseInt(localStorage.getItem('stepperNo'));
  }
}
