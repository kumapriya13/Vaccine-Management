import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

import { UserService } from '../../../../../core';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-page-book-slot',
  templateUrl: './page-book-slot.component.html',
  styleUrls: ['./page-book-slot.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageBookSlotComponent implements OnInit {
  public renderCal: boolean = true;
  selectedVaccine: boolean = true;
  isSubmited: boolean = false;

  @Input('material') _material: any = null;
  @Input() set material(value: any) {
    console.clear();
    console.log(value.name);
    let dobs = JSON.parse(localStorage.getItem('recipient-user')).dob
    if (value.name == 'Moderna' || value.name == 'Janssen') {
      let today = new Date();
      var birthDate = new Date(dobs);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (m < 0) {
        m += 12;
      }
      if (age < 18) {
        this._dateSlotList = null;
        this._NotificationService.showNotification(
          'Age should be greater than or equal to 18',
          'top',
          'error'
        );
      }
      else {
        this._material = value;
        this.materialEmitter.emit(this._material);
      }
    }
    if (value.name == 'Pfizer') {
      this._material = value;
      this.materialEmitter.emit(this._material);
    }

  }
  @Output('changeMaterial')
  materialEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('calendar', { static: false }) calendar: MatCalendar<Date>;

  dateSlot: any = null;
  @Input('site') _site: any = null;
  @Input() set site(value: any) {
    if (value) {
      this._site = value;
    }

    // if (value && this.selectedVaccine) {
    //   this.material =
    //     value.$expanded.availableVaccines.length > 0
    //     // ? value.$expanded.availableVaccines[0]
    //       ? this.material
    //       : null;
    // }
  }

  minDate = new Date();
  events: string[] = [];
  @Input('date') selectedDate = new Date();
  @Input('dateSlotList') _dateSlotList = [];
  @Input() set dateSlotList(value: any[]) {
    value.sort(function (obj1: any, obj2: any) {
      let obj1Start_time: any = moment(obj1.start_time).format('HH:mm');
      let obj2Start_time: any = moment(obj2.start_time).format('HH:mm');

      obj1Start_time = moment(obj1Start_time, 'HH:mm');
      obj2Start_time = moment(obj2Start_time, 'HH:mm');

      return obj1Start_time.isBefore(obj2Start_time) ? -1 : 1;
    });
    this._dateSlotList = value;
  }

  @Output('changeDate')
  changeDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output('changeSite') changeSite: EventEmitter<any> = new EventEmitter<any>();
  @Input('siteList') siteList: any[] = [];
  @Input('checkSlot') _checkSlot: any[] = [];
  @Input() set checkSlot(value: any[]) {
    this._checkSlot = value;
    if (this.calendar) {
      this.calendar.updateTodaysDate();
    }
  }
  @Output('changeMonth')
  changeMonth: EventEmitter<Date> = new EventEmitter<Date>();

  @Output('bookAppointment')
  bookAppointment: EventEmitter<any> = new EventEmitter<any>();
  @Output('changeVaccination')
  _changeVaccination: EventEmitter<any> = new EventEmitter<any>();

  @Input('recipientVisit') _recipientVisit: any = {};
  @Input() set recipientVisit(value: any[]) {
    this._recipientVisit = this.userService.getRecipientVisitsTolocalStorageInAscendingByCreatedTime();
    if (this._recipientVisit['results'].length > 0) {
      let obj = {
        id: this._recipientVisit['results'][0].$expanded.material_id,
        name: this._recipientVisit['results'][0].$expanded.vaccine,
      };

      let visitLenght = this._recipientVisit['results'].length;
      let lastVisit = this._recipientVisit['results'][visitLenght - 1];
      let lastVisitStartDate: Date = lastVisit.start_time;
      let gapsInDays: number = lastVisit.$expanded.gaps_in_days_between_doses;
      let nextVisitDate = moment(lastVisitStartDate)
        .add(gapsInDays, 'd')
        .toDate();
      this.minDate = nextVisitDate;
      this.changeDate.emit(nextVisitDate);
      this.changeMonth.emit(nextVisitDate);

      this.material = obj;
      this.selectedVaccine = false;
    } else {
      this.minDate = new Date();
      this.selectedDate = this.minDate;
      this.changeDate.emit(this.minDate);
      this.renderCal = false;
      setTimeout(() => {
        this.renderCal = true;
        this.bindEventToCalender();
        this.changeMonth.emit(this.minDate);
        this.calendar.updateTodaysDate();
      }, 1);
      this.selectedVaccine = true;
    }
  }
  get recipientVisit(): any[] {
    return this._recipientVisit;
  }

  previous_gray: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    let currentdate = this.datepipe.transform(this.minDate, 'yyyy-MM-dd');
    let cDate = this.datepipe.transform(cellDate, 'yyyy-MM-dd');

    if (new Date(cDate) < new Date(currentdate)) {
      return 'recipient-page-book-slot-component-previous-date-class';
    } else if (new Date(cDate) >= new Date(currentdate)) {
      let valid = this._checkSlot.find((itemDate) => {
        let d1 = moment(cellDate).format('YYYY-MM-DD');
        let d2 = moment(itemDate).format('YYYY-MM-DD');
        return 0 == d1.localeCompare(d2);
      });

      if (!valid) {
        return 'recipient-page-book-slot-component-advance-date-class';
      }
    }
    return '';
  };

  constructor(
    private userService: UserService,
    private datepipe: DatePipe,
    private renderer: Renderer2,
    private _NotificationService: NotificationService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.bindEventToCalender();
  }

  bindEventToCalender() {
    const buttons = document.querySelectorAll(
      '.mat-calendar-previous-button, .mat-calendar-next-button'
    );

    if (buttons) {
      let $this = this;
      Array.from(buttons).forEach((button) => {
        $this.renderer.listen(button, 'click', () => {
          let date = this.calendar.monthView.activeDate;
          this.changeMonth.emit(date);
        });
      });
    }
  }

  siteHandler(site: any) {
    this.changeSite.emit(site);
  }

  changeVaccination() {
    this._changeVaccination.emit();
  }

  setDateSlot(dateSlot) {
    this.dateSlot = dateSlot;
  }
  onSelect(event) {
    this.selectedDate = event;
    // console.log(this.selectedDate,'---')
    this.dateSlot = null;
    this.changeDate.emit(this.selectedDate);
  }
  reqBookAppointment() {
    this.isSubmited = true;
    let Obj = {
      dateSlot: this.dateSlot,
      material: this._material,
    };
    // console.log('mattt',this._material.id);
    let dobs = JSON.parse(localStorage.getItem('recipient-user')).dob
    // console.log('recepient',JSON.parse(localStorage.getItem('recipient-user')));
    console.log(this._material);
    if (this._material.name == 'Moderna' || this._material.name == 'Janssen') {
      let today = new Date();
      var birthDate = new Date(dobs);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (m < 0) {
        m += 12;
      }
      if (age < 18) {
        this._dateSlotList = null;
        return this._NotificationService.showNotification(
          'Age should be greater than or equal to 18',
          'top',
          'error'
        );
      }
      else {
        this.bookAppointment.emit(Obj);
      }
    }
    if (this._material.name == 'Pfizer') {
      this.bookAppointment.emit(Obj);
    }
    // console.log(Obj)
    //this.bookAppointment.emit(Obj);
  }

  checkForDisable(dateSlotItem) {
    let todayDate = moment(new Date());
    let selectedDate = moment(this.selectedDate);
    if (todayDate.isBefore(selectedDate)) {
      return false;
    }

    let currentTime: any = moment(new Date()).format('HH:mm');
    let stotTime: any = moment(dateSlotItem.start_time).format('HH:mm');

    currentTime = moment(currentTime, 'HH:mm');
    stotTime = moment(stotTime, 'HH:mm');

    return stotTime.isBefore(currentTime);
  }

  myFilter(): boolean {
    return false;
  }

  changeMaterialHandler(value) {
    this.material = value;

  }
}
