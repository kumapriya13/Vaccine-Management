import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { ReceptionistService } from '../../../core';

//import { ReceptionistService } from '../super-admin.service';
@Component({
  selector: 'app-page-appointment-list',
  templateUrl: './page-appointment-list.component.html',
  styleUrls: ['./page-appointment-list.component.scss']
})
export class PageAppointmentListComponent implements OnInit {

  dataSource: any[] = [];

  constructor(
    private _superAdminService: ReceptionistService,
    private _location: Location,
    private notify: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getStaticDataAppointment();
  }



  getStaticDataAppointment() {

    this._superAdminService.getStaticDataAppointment().subscribe(
      (res) => {
        console.log(res.upcoming);
        this.dataSource = res.upcoming.results;
        //   this.totalCount = res.resultMetadata.count;
        // this.pageIndex = res.resultMetadata.page;
        //   console.log(res.results.$expanded.site_admins);
      },
      (err) => {
        console.log(err);
      }
    );
    // this.dataSource = [
    //   {Time: '12:30',  Recipient : "Wallace Neal",Dose:"1st dose", Seat:"01", Sitename:"New York Presbyterian Hospital",RecipientID:"Survey #43435"},
    //   {Time: '1:30',  Recipient : "Wallace Neal",Dose:"1st dose", Seat:"02", Sitename:"New York Presbyterian Hospital",RecipientID:"Survey #43435"},
    //   {Time: '2:00',  Recipient : "Wallace Neal",Dose:"1st dose", Seat:"02", Sitename:"New York Presbyterian Hospital",RecipientID:"Survey #43435"},
    //   {Time: '2:30',  Recipient : "Wallace Neal",Dose:"1st dose", Seat:"01", Sitename:"New York Presbyterian Hospital",RecipientID:"Survey #43435"},

    //   ]

  }

}
