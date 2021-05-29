import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ad-hoc-time-schedule',
  templateUrl: './ad-hoc-time-schedule.component.html',
  styleUrls: ['./ad-hoc-time-schedule.component.scss'],
})
export class AdHocTimeScheduleComponent implements OnInit {
  @Output() openChange = new EventEmitter();
  @Output() timeScheduled = new EventEmitter<Date>();
  @ViewChild('content') contentTemplate: TemplateRef<any>;

  @Input()
  set open(open: boolean) {
    this._open = open;
    this.open && this.openModal();
  }

  get open(): boolean {
    return this._open;
  }

  todayOrFuture: string = 'today';
  hours: string[] = [
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
  minutes: string[] = ['00', '15', '30', '45'];

  timepickerOptions: string[] = [];

  futureTime: string;
  futureDate: Date = new Date();
  todayHour: string = '00';
  todayMinute: string = '00';

  private _open: boolean;

  constructor(private modalService: NgbModal) {
    for (let index = 0; index <= 23; index++) {
      let hour: any = index;
      if (index < 10) {
        hour = `0${hour}`;
      }
      this.minutes.forEach(minute => {
        this.timepickerOptions.push(`${hour}:${minute}`);
      });
    }
    this.futureTime = this.timepickerOptions[0];
  }

  ngOnInit(): void {}

  openModal(): void {
    this.modalService.open(this.contentTemplate).result.finally(() => {
      this.open = false;
      this.openChange.emit(this.open);
    });
  }

  confirm(modal): void {
    const scheduledDateTime = this.getResult();
    if (scheduledDateTime < new Date()) {
      return alert('Please select date time ahead of current time');
    }

    this.timeScheduled.emit(scheduledDateTime);
    modal.close();
  }

  private getResult(): any {
    let scheduledDateTime;
    if (this.todayOrFuture === 'today') {
      const timeToAdd = parseInt(this.todayHour) * 60 + parseInt(this.todayMinute);

      scheduledDateTime = new Date(new Date().getTime() + timeToAdd * 60000);
    } else {
      const [ h, m ] = this.futureTime.split(':');
      this.futureDate.setHours(parseInt(h));
      this.futureDate.setMinutes(parseInt(m));
      this.futureDate.setSeconds(0);
      scheduledDateTime = this.futureDate;
    }

    return scheduledDateTime;
  }
}
