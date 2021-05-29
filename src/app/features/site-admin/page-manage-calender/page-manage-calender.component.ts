import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as _ from 'lodash';

import { SiteAdminService, AuthManageService } from '../../../core';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'app-page-manage-calender',
  templateUrl: './page-manage-calender.component.html',
  styleUrls: ['./page-manage-calender.component.scss'],
})
export class PageManageCalenderComponent implements OnInit {
  days: any[] = [
    { id: '0', short: 'Sun', long: 'Sunday' },
    { id: '1', short: 'Mon', long: 'Monday' },
    { id: '2', short: 'Tue', long: 'Tuesday' },
    { id: '3', short: 'Wed', long: 'Wednesday' },
    { id: '4', short: 'Thu', long: 'Thursday' },
    { id: '5', short: 'Fri', long: 'Friday' },
    { id: '6', short: 'Sat', long: 'Saturday' },
  ];
  end_time: any;
  hour: number = 0;
  hours: any[] = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ];
  is24Hours: boolean = false;
  minDate = new Date();
  minute: number = 0;
  minutes: string[] = ['00', '15', '30', '45'];
  reqobj: { site_id: string; seat_name: string };
  sameSchedule: boolean = false;
  seatData: any;
  seatDataInfo: any;
  selectedDates: any = {};
  selectedDays: any[] = [];
  siteName: string;
  start_time: any;
  multiSeats: any;
  removable: boolean = true;
  selectable: boolean = true;

  constructor(
    private _location: Location,
    private _router: Router,
    private route: ActivatedRoute,
    private notify: NotificationService,
    private seatsService: SiteAdminService,
    private authManageService: AuthManageService,
    private _loader: SpinnerService
  ) {}
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
    this.multiSeats = JSON.parse(this.route.snapshot.paramMap.get('seats'));

    if (!this.multiSeats) {
      this.cancel();
    }

    this.siteName = this.authManageService.getLoggedInUser().sites[0].site_name;
  }

  removeSeat(seat) {
    const index = this.multiSeats.findIndex((seatId) => seatId.id === seat.id);

    if (index !== -1) {
      this.multiSeats.splice(index, 1);
    }
  }

  setDates(key, date) {
    this.selectedDates[key] = moment(date).format('YYYY-MM-DD');
  }

  setSameSchedule() {
    this.sameSchedule = !this.sameSchedule;
    this.is24Hours = false;
    this.selectedDays.forEach((day) => (day.SeatDay.hours_24 = false));
  }

  setSlotTime(index, value) {
    this[index] =
      index === 'hour' && parseInt(value) > 0
        ? parseInt(value) * 60
        : parseInt(value);
    this.selectedDays.forEach(
      (day) => (day.SeatDay.slot_duration = this.hour + this.minute)
    );
  }

  setTime(field, value) {
    this[field] = moment(value, ['h:mm A']).format('HH:mm:ss');
    this.selectedDays.forEach((day) => (day.SeatDay[field] = this[field]));
  }

  isDaySelected(day) {
    return this.selectedDays.some(
      (selected) => selected.SeatDay.day_of_week === day.id
    );
  }

  setIs24Hours() {
    this.is24Hours = !this.is24Hours;
    this.selectedDays.forEach((day) => (day.SeatDay.hours_24 = this.is24Hours));

    if (this.is24Hours) {
      this.selectedDays.forEach((day) => (day.SeatDay.end_time = '00:00:00'));
    }
  }

  setDayOfWeek(day) {
    const getIndex = (selected) => selected.SeatDay.day_of_week === day.id;
    const seatObject = {
      SeatDay: {
        day_of_week: day.id,
        exclude_national_holidays: false,
        exclude_local_holidays: false,
        hours_24: false,
        start_time: this.is24Hours
          ? '00:00:00'
          : this.start_time
          ? this.start_time
          : '00:00:00',
        end_time: this.is24Hours
          ? '00:00:00'
          : this.end_time
          ? this.end_time
          : '00:00:00',
        slot_duration: this.hour + this.minute,
        seat_breaks: [],
      },
    };

    if (!this.selectedDays.some(getIndex)) {
      this.selectedDays.push(seatObject);
    } else {
      this.selectedDays.splice(this.selectedDays.findIndex(getIndex), 1);
    }

    this.selectedDays.sort(
      (a, b) => a.SeatDay.day_of_week - b.SeatDay.day_of_week
    );
  }

  disablePreview() {
    if (
      _.isEmpty(this.selectedDates.start_date) ||
      _.isNull(this.selectedDates.start_date) ||
      _.isEmpty(this.selectedDates.end_date) ||
      _.isNull(this.selectedDates.end_date) ||
      _.isEmpty(this.selectedDays) ||
      _.isNull(this.selectedDays)
    ) {
      return true;
    }

    for (let day of this.selectedDays) {
      if (day.SeatDay.slot_duration === 0) {
        return true;
      }
    }

    return false;
  }

  preview() {
    
    if (this.selectedDates.end_date == 'Invalid date') {
      this.notify.showNotification(
        `Please select the End-date`,
        'top',
        'error'
      );
      console.log(this.selectedDates.start_date, this.selectedDates.end_date);
      return false;
    }

    this.multiSeats.forEach((seat) => {
      const reqObj = {
        site_id: seat.site_id,
        seat_name: seat.seat,
        seat_days: this.selectedDays,
        vaccine_id: seat.vaccine_id,
        seat_allocation_type: seat.allocation,
        quantity_in_vials: seat.quantity_in_vials,
        vaccinator_ids: seat.vaccinator_ids,
        status: seat.status,
        id: seat.id,
        is_active: seat.is_active,
      };
      this.seatsService.addSchedule(reqObj).subscribe(
        (res) => {
          this.notify.showNotification(
            `Preview generated successfully`,
            'top',
            'success'
          );

          this._router.navigate([
            '/site-admin/preview-calender',
            {
              selectedDates: JSON.stringify(this.selectedDates),
              seats: JSON.stringify(this.multiSeats),
            },
          ]);
        },
        (err) => {
          console.log('Err', err);
        }
      );
    });
  }

  cancel() {
    this._router.navigate(['/site-admin/list-seat']);
  }
}
