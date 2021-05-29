import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'hours-slot-time',
  templateUrl: './hours-slot-time.component.html',
  styleUrls: ['./hours-slot-time.component.scss']
})
export class HoursSlotTimeComponent implements OnInit {
  @Input() day: any;

  hours: any[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  is24Hours: boolean = false;
  minutes: string[] = ['00', '15', '30', '45'];
  selectedHour: any;
  hour: number = 0;
  minute: number = 0;

  constructor() { }

  ngOnInit(): void { }

  setIs24Hours() {
    this.is24Hours = !this.is24Hours;
    this.day.SeatDay.hours_24 = this.is24Hours;
    
    if (this.is24Hours) {
      this.day.SeatDay.start_time = "00:00:00";
      this.day.SeatDay.end_time = "00:00:00";
    }
  }

  setTime(key, time) {
    this.day.SeatDay[key] = moment(time, ['h:mm A']).format("HH:mm:ss");
  }

  setSlotTime(index, value) {
    this[index] = (index === 'hour' && parseInt(value) > 0) ? parseInt(value) * 60 : parseInt(value);
    this.day.SeatDay.slot_duration = this.hour + this.minute;
  }
}
