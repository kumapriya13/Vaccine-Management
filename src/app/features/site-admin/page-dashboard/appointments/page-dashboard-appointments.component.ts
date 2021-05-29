import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SiteAdminService, AuthManageService } from '../../../../core';
import { PageDashboardComponent } from '../page-dashboard.component';

@Component({
  selector: 'site-admin-page-dashboard-appointments',
  templateUrl: './page-dashboard-appointments.component.html',
  styleUrls: ['../page-dashboard.component.scss'],
})
export class PageDashboardAppointmentsComponent implements OnInit {
  loggedInUser: any;
  appointmentsList: any ;
  vaccinatorsList: any = [];

  private readonly appoinmentsSortOrder = [
    "Time Slots",
    "Booked Visit",
    "1st Dose Scheduled",
    "2nd Dose Scheduled",
    "Missed",
    "Completed",
    "1st Dose Completed",
    "2nd Dose Completed",
  ];

  constructor(
    private authManageService: AuthManageService,
    private siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private datePipe: DatePipe,
    private _spinner: SpinnerService,
    private dashboardComponent: PageDashboardComponent
  ) {
  }
  date2  = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  // ********** payload for appointment ************
  payload = {
    "startDate": this.date2,
  }

  get date(): Date {
    return this.dashboardComponent.selectedDate;
  }

  set date(date: Date) {
    this.dashboardComponent.selectedDate = date;
    console.log(this.dashboardComponent.selectedDate)
  }

  ngOnInit() {

    this.loggedInUser = this.authManageService.getLoggedInUser();
    // ************* loading list of appointments  *************
    this.slotWeeklyVacsReport(this.payload)
  }

  slotWeeklyVacsReport(payload){
    this._spinner.showLoader();
    // ************* subscription of appointments  *************
    this.siteAdminService.slotWeeklyVacsReport(payload).subscribe((data) => {
      this.appointmentsList =data &&data.data && data.data.length? this.sortDataBasedOnAppoinmentsOrder(data.data):[];
      //this.appointmentsList[0].Total = 232
      this._spinner.hideLoader();
    });

    setTimeout(() => {
      this._spinner.hideLoader();
    }, 10000);
  }

  public sortDataBasedOnAppoinmentsOrder(records): any[] {
    let sortedAppoinments = [];
    this.appoinmentsSortOrder.forEach(sortKey => {
      const row = records.find(record => {
        return record.Detail === sortKey;
      });
      row && sortedAppoinments.push(row);
    });
    return sortedAppoinments;
  }

  dateChange(event: any) {
    // ************* Date filter event  *************
    this._spinner.showLoader();
    this.payload.startDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.slotWeeklyVacsReport(this.payload);
  }

  // ************  For Date range  *********************
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
