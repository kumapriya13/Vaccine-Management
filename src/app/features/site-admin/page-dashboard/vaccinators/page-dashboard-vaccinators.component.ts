import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/core/services/spinner.service';
// import { NotificationService } from 'src/app/shared/services/notification.service';
import { SiteAdminService, AuthManageService } from '../../../../core';
import { PageDashboardComponent } from '../page-dashboard.component';

@Component({
  selector: 'site-admin-page-dashboard-vaccinators',
  templateUrl: './page-dashboard-vaccinators.component.html',
  styleUrls: ['../page-dashboard.component.scss'],
})
export class PageDashboardVaccinatorsComponent implements OnInit {
  loggedInUser: any;
  vaccinatorList: any ;
  vaccinatorsList: any = [];
  vaccinatorData: any;
  startDate: any;
  endDate: any;
  payload: any;

  constructor(
    private authManageService: AuthManageService,
    private siteAdminService: SiteAdminService,
    private datePipe: DatePipe,
    private _spinner: SpinnerService,
    private dashboardComponent: PageDashboardComponent
  ) {
  }

  get date(): Date {
    return this.dashboardComponent.selectedDate;
  }

  set date(date: Date) {
    this.dashboardComponent.selectedDate = date;
  }


  ngOnInit(): void {
    this.startDate = moment(new Date(this.date)).startOf('week').format('YYYY-MM-DD');
    this.endDate =  moment(new Date(this.date)).endOf('week').format('YYYY-MM-DD');
    this.payload = {
        "startDate": this.startDate,
        "endDate": this.endDate
    }


    this._spinner.showLoader();
    this.loggedInUser = this.authManageService.getLoggedInUser();
    console.log("this.loggedInUser",this.loggedInUser)
    // ************* loading list of appointments  *************
    this.slotWeeklyVaccinatorReport(this.payload)
  }

  slotWeeklyVaccinatorReport(payload){
    // ************* subscription of appointments  *************
    this.siteAdminService.slotWeeklyVaccinatorReport(payload).subscribe((data) => {
      this.vaccinatorList = data.data.vaccinators;
      //this.appointmentsList[0].Total = 232
      console.log("data=====",data);
      this._spinner.hideLoader();
    });

    setTimeout(() => {
      this._spinner.hideLoader();
    }, 10000);
  }

  dateChange(event: any) {
    // ************* Date filter event  *************
    this._spinner.showLoader();
    this.payload.startDate = moment(new Date(event.value)).startOf('week').format('YYYY-MM-DD');
    this.payload.endDate =  moment(new Date(event.value)).endOf('week').format('YYYY-MM-DD');
    this.slotWeeklyVaccinatorReport(this.payload);
  }

  // // ************  For Date range  *********************
  // startChange(event:any)
  // {
  //   if(event.value)
  //  console.log("startChange",this.datePipe.transform(event.value, "yyyy-MM-dd"))
  // }
  // endChange(event:any)
  // {
  //   if(event.value)
  //   console.log("endChange",this.datePipe.transform(event.value, "yyyy-MM-dd"))
  //   this.ngOnInit
  // // console.log("endChange",event.value)
  // }

}
