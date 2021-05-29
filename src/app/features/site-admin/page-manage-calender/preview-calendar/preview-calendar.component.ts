import { AuthManageService } from 'src/app/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SiteAdminService } from '../../../../core';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'app-preview-calendar',
  templateUrl: './preview-calendar.component.html',
  styleUrls: ['./preview-calendar.component.scss']
})
export class PreviewCalendarComponent implements OnInit {
  dateRange = [];
  multiSeats: any;
  previewData: any;
  removable: boolean = true;
  req: any = {}
  sameSchedule: boolean = false;
  seatId: string;
  seatData: any;
  selectable: boolean = true;
  selectedDates: any;
  siteName: string;
  setDates: any;
  dow = [1, 2, 3, 4, 5, 6, 7];
  slotCount: any;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private seatsService: SiteAdminService,
    private authManageService: AuthManageService,
    private spinner: SpinnerService,
    private _router: Router,
    ) { }

  ngOnInit(): void {
    this.multiSeats = JSON.parse(this.route.snapshot.paramMap.get('seats'));
    this.selectedDates = JSON.parse(this.route.snapshot.paramMap.get('selectedDates')); //this.seatDateService.getDates();
    this.seatId = this.multiSeats[0].id;
    this.siteName = this.authManageService.getLoggedInUser().sites[0].site_name;

    if (this.selectedDates) {
      this.getPreviewSchedule();
      this.setDates = {
        start: moment(this.selectedDates.start_date).format('MM/DD/YYYY'),
        end: moment(this.selectedDates.end_date).format('MM/DD/YYYY')
      };
    } else {
      this.cancel();
    }
  }

  setSameSchedule() {
    this.sameSchedule = !this.sameSchedule;
  }

  getPreviewSchedule() {
    this.spinner.showLoader();
    const sow = moment(this.selectedDates.start_date);
    const req = {
      criteria: {
        seat_id: this.seatId,
        startDate: this.selectedDates.start_date,
        endDate: this.selectedDates.end_date
      },
      page: 1,
      pageLength: 1000
    };
    this.seatsService.getPreviewSchedule(req).subscribe(res => {
      const { results } = res;
      console.clear();
      console.log("resultMetadata",res);
      this.slotCount = res.resultMetadata.count ? res.resultMetadata.count : 0;
      for (var i = 0; i <= 6; i++) {
        let day = moment(sow).add(i, "days").format('dddd');
        let dayIndex:number = moment(sow).add(i, "days").day();
        let date = moment(sow).add(i, "days").format('MMM Do YY');
        const getSlots = results.filter(result => parseInt(result.day_of_week) === dayIndex);
        getSlots.forEach(time => time.slot_start_time = moment(time.slot_start_time, ['HH:mm:ss']).format('h:mm A'));

        console.log(getSlots);
        this.dateRange.push({
          day: day,
          date: date,
          slots: getSlots
        });
      }
      this.spinner.hideLoader();
    },
    (err) => { 
      this.spinner.hideLoader();
      console.log(err);
    });
  }

  generateSlotsForDateRange() {
    const data = {
      seatId: this.seatId,
      startDate: this.selectedDates.start_date,
      endDate: this.selectedDates.end_date
    };

    this.seatsService.generateSlotsForDateRange(data).subscribe(res => {
      this.notify.showNotification(
        'Slots generated successfully',
        'top',
        'success'
      );
      this._router.navigate(['/site-admin/list-seat']);
    }, err => console.log(err));
  }

  generateSlotsForDateRangeBatch() {
    const seatIds = this.multiSeats.map((seats) => seats.id);
    const data = {
      seatIds: seatIds,
      startDate: this.selectedDates.start_date,
      endDate: this.selectedDates.end_date
    };

    this.seatsService.generateSlotsForDateRangeBatch(data).subscribe(res => {
      this.notify.showNotification(
        'Slots generated successfully',
        'top',
        'success'
      );
    }, err => console.log(err));
    this._router.navigate(['/site-admin/list-seat']);
  }

  cancel() {
    this._router.navigate(['/site-admin/manage-calender']);
  }

  checkIsNumber(slotCount: number,length: number){
    //alert(length)
   return !isNaN(slotCount * length)
  }

}
