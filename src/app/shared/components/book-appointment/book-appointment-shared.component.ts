import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { AdminTypes, SiteAdminService, SuperAdminService } from '../../../core';
import { AuthManageService } from '../../../core/services/auth/auth-manage.service';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { AdminService } from '../../../core/services/admin.service';
import { debounceTime, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../../../core/services/auth/admin-auth.service';

@Component({
  selector: 'app-book-appointment-shared',
  templateUrl: './book-appointment-shared.component.html',
  styleUrls: ['./book-appointment-shared.component.scss'],
})
export class BookAppointmentSharedComponent implements OnInit {
  minDate: Date;
  selectedSiteId: string = "";
  selectedDate = new Date();
  materialList: any[];
  dateSlotList: any[];
  materialId: string = '';
  dateSlot: any = null;
  isSubmited: boolean = false;
  siteId: any;
  visitType = [
    { count: 0, name: '1st Dose' },
    { count: 1, name: '2nd Dose' },
    { count: 2, name: '3rd Dose' },
    { count: 3, name: '4th Dose' }];
  currentVisit: any;
  serviceSubscription: Subscription[] = [];
  recipient_id: any;
  checkAdmin: boolean = false;
  sitelists: any = [];
  adminType: string = '';

  siteNameId: string = ''
  providerSiteAdmin: string = '';
  @Input() modelContent: boolean = false;
  @Input() redirectAfterSave: string = '';
  dobdate: string;
  @Input('recipient')
  set recipient(value: string) {
    this.recipient_id = value
    console.log("booking data inside shared", value);
    this.initializeAllData();

  }
  @Output() showBookedAppointment = new EventEmitter();
  visits: any[];
  sites = [];

  constructor(
    private adminService: AdminService,
    private _siteAdminService: SiteAdminService,
    private _router: Router,
    private notify: NotificationService,
    private activatedRoute: ActivatedRoute,
    private authManageService: AuthManageService,
    private adminAuthService: AdminAuthService,
    private datePipe: DatePipe,
    private _spinner: SpinnerService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private _superAdminService: SuperAdminService
  ) {
    this.recipient_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.adminType = this.authManageService.getLoggedInUser();
    this.checkAdmin = this.adminType['user_type'] == 'provider_admin' ? true : false;
    this.dateSlotList = [];
  }

  onSelect(event) {
    this.dateSlot = null;
    this.selectedDate = event;
    this.getSlotList();
  }
  ngOnInit(): void {
    this.sites = this.authManageService.getLoggedInUser()?.sites;
    if (!localStorage.getItem('selectedSiteId')) {
      localStorage.setItem('selectedSiteId', this.sites[0].site_id);
    }
    this.selectedSiteId = localStorage.getItem('selectedSiteId');
    console.log('selectedSiteId : ' + this.selectedSiteId);

    if (this.checkAdmin) {
      this.getNameOfSite()
    }
    this.getMaterialListNames();
  }

  initializeAllData() {
    if (this.recipient_id) {
      this.serviceSubscription.push(this.adminService.getRecipientVisits2(this.recipient_id).subscribe(
        (visits: any) => {
          this.visits = visits.results;

          if (visits.hasOwnProperty('resultMetadata') && visits.resultMetadata.hasOwnProperty('count')) {
            let vc = (this.visitType.map(d => d.count).indexOf(visits.resultMetadata.count));
            if (vc > -1) {
              try {
                this.currentVisit = this.visitType[vc].name;
              } catch (err) {
                this.currentVisit = '';
              }

            }
          }

          if (this.visits.length > 0) {
            const visitLenght = this.visits.length;
            const lastVisit = this.visits[visitLenght - 1];
            const lastVisitStartDate: Date = lastVisit.start_time;
            let gapsInDays: number = lastVisit.$expanded.gaps_in_days_between_doses;

            switch (this.adminAuthService.getAdminType()) {
              case AdminTypes.superAdmin:
              case AdminTypes.providerAdmin:
              case AdminTypes.siteAdmin:
                gapsInDays -= 4;
                break;
            }

            const nextVisitDate = moment(lastVisitStartDate)
              .add(gapsInDays, 'd')
              .toDate();
            this.minDate = nextVisitDate;
            this.materialId = this.visits[0].material_id;
          } else {
            this.minDate = new Date();
          }
          this.cdr.detectChanges();
          this.selectedDate = this.minDate;

          if (!localStorage.getItem('selectedSiteId')) {
            this.checkSlotAppioment(this.minDate, { siteId: this.providerSiteAdmin });
          } else {
            this.selectedSiteId = localStorage.getItem('selectedSiteId');
            this.checkSlotAppioment(this.minDate, { siteId: this.selectedSiteId });
          }

          this.bindEventToCalender();
        }))
    }

  }
  getNameOfSite() {
    const reqObj = {
      page: 1,
      pageLength: 100,
    };
    this._spinner.showLoader();
    this._superAdminService
      .getSite(reqObj)
      .subscribe(
        (res) => {
          this._spinner.hideLoader();
          this.sitelists = res.results;
          this.siteNameId = this.providerSiteAdmin ? this.providerSiteAdmin : this.authManageService.getLoggedInUser()['site_ids'][0]
        },
        (err) => {
          this._spinner.hideLoader();
          console.log(err);
        }
      );
  }
  @ViewChild('calendar') calendar: MatCalendar<Date>;
  @Input('checkSlot') _checkSlot: any[] = [];
  @Input() set checkSlot(value: any[]) {
    this._checkSlot = value;
    if (this.calendar) {
      this.calendar.updateTodaysDate();
    }
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

          if (!localStorage.getItem('selectedSiteId')) {
            this.checkSlotAppioment(date, { siteId: this.providerSiteAdmin });
          } else {
            this.selectedSiteId = localStorage.getItem('selectedSiteId');
            this.checkSlotAppioment(date, { siteId: this.selectedSiteId });
          }


        });
      });
    }
  }

  checkSlotAppioment(date: Date, obj) {
    this.siteId = obj.siteId ? obj.siteId : this.authManageService.getLoggedInUser()['site_ids'][0];

    if (!this.siteId) return;
    let reqObj = {
      siteId: this.siteId,
      yearMonth: moment(date).format('YYYY-MM'),
    };

    this._spinner.showLoader();
    this.serviceSubscription.push(this._siteAdminService.checkSlotDate(reqObj).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.checkSlot = res;

        if (this.materialId) {
          this.selectedDate = this.selectedDate || this.minDate;
          this.getSlotList();
        }
      },
      (err) => {
        this._spinner.hideLoader();
        console.log(err);
      }
    ));
  }

  previous_gray: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    let currentdate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
    let cDate = this.datePipe.transform(cellDate, 'yyyy-MM-dd');

    if (new Date(cDate) < new Date(currentdate)) {
      return 'previous-date-class';
    } else if (new Date(cDate) >= new Date(currentdate)) {
      let valid = this._checkSlot.find((itemDate) => {
        let d1 = moment(cellDate).format('YYYY-MM-DD');
        let d2 = moment(itemDate).format('YYYY-MM-DD');
        return 0 == d1.localeCompare(d2);
      });

      if (!valid) {
        return 'advance-date-class';
      }
    }

    return '';
  };

  getMaterialListNames() {
    this.serviceSubscription.push(this._siteAdminService.getMaterialListNames().subscribe((res) => {
      this.materialList = res.results;
    }));
  }

  getSlotList() {
    if (this.materialId == '') {
      this.notify.showNotification('select vaccine', 'top', 'error');
      return;
    }
    if (this.materialId != '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
      // this.getage(this.dobdate);
      this.dobdate = localStorage.getItem('recepientdob');
      let today = new Date();
      var birthDate = new Date(this.dobdate);

      var age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {

        this.dateSlotList = [];
        return this.notify.showNotification(
          'Age should be greater than or equal to 18',
          'top',
          'error'
        );

      }

      else {
        if (!localStorage.getItem('selectedSiteId')) {
          this.siteId = this.providerSiteAdmin ? this.providerSiteAdmin : this.authManageService.getLoggedInUser()['site_ids'][0];
        } else {
          this.siteId = localStorage.getItem('selectedSiteId');
        }


        let reqObj = {
          siteId: this.siteId,
          slotDate: moment(this.selectedDate).format('YYYY-MM-DD'),
          materialId: this.materialId,
          recipient_id: this.recipient_id,
        };

        console.log(this.siteId);

        this._siteAdminService.getSlotAdminAvailableValues(reqObj).subscribe(
          (res) => {
            let _dateSlotList: any[] = res.results;
            _dateSlotList.sort(function (obj1: any, obj2: any) {
              let obj1Start_time: any = moment(obj1.start_time).format('HH:mm');
              let obj2Start_time: any = moment(obj2.start_time).format('HH:mm');

              obj1Start_time = moment(obj1Start_time, 'HH:mm');
              obj2Start_time = moment(obj2Start_time, 'HH:mm');

              return obj1Start_time.isBefore(obj2Start_time) ? -1 : 1;
            });
            this.dateSlotList = _dateSlotList;
          },
          (err) => {
            console.log(err);
          }
        );
      }

    }

    if (this.materialId == '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
      if (!localStorage.getItem('selectedSiteId')) {
        this.siteId = this.providerSiteAdmin ? this.providerSiteAdmin : this.authManageService.getLoggedInUser()['site_ids'][0];
      } else {
        this.siteId = localStorage.getItem('selectedSiteId');
      }

      let reqObj = {
        siteId: this.siteId,
        slotDate: moment(this.selectedDate).format('YYYY-MM-DD'),
        materialId: this.materialId,
        recipient_id: this.recipient_id,
      };

      console.log(this.siteId);

      this._siteAdminService.getSlotAdminAvailableValues(reqObj).subscribe(
        (res) => {
          let _dateSlotList: any[] = res.results;
          _dateSlotList.sort(function (obj1: any, obj2: any) {
            let obj1Start_time: any = moment(obj1.start_time).format('HH:mm');
            let obj2Start_time: any = moment(obj2.start_time).format('HH:mm');

            obj1Start_time = moment(obj1Start_time, 'HH:mm');
            obj2Start_time = moment(obj2Start_time, 'HH:mm');

            return obj1Start_time.isBefore(obj2Start_time) ? -1 : 1;
          });
          this.dateSlotList = _dateSlotList;
        },
        (err) => {
          console.log(err);
        }
      );
    }


  }

  setDateSlot(dateSlot) {
    this.dateSlot = dateSlot;
  }

  // - {{protocol}}://{{host}}:{{port}}/site/adminScheduleVisitByDateTime

  reqBookAppointment() {
    this.isSubmited = true;
    let reqObj = {
      recipient_id: this.recipient_id,
      site_id: this.siteId,
      startDateTime: this.dateSlot.start_time,
      endDateTime: this.dateSlot.end_time,
      material_id: this.materialId,
    };

    if (this.materialId != '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
      // this.getage(this.dobdate);
      this.dobdate = localStorage.getItem('recepientdob');
      let today = new Date();
      var birthDate = new Date(this.dobdate);

      var age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        return this.notify.showNotification(
          'Age should be greater than or equal to 18',
          'top',
          'error'
        );
      }

      else {
        this._siteAdminService.siteAdminScheduleVisitByDateTime(reqObj).subscribe(
          (res) => {
            this.notify.showNotification(
              'Appointment booked successfully',
              'top',
              'success'
            );

            if(this.modelContent === true){
              this.showBookedAppointment.emit();
              this._spinner.recepientIDSubject.next({status: 'load_seats'})
            } else {
              if(this.redirectAfterSave.trim() !=''){
                this._router.navigate([this.redirectAfterSave]);
              }
              
            }
    
    
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );
      }

    }

    if (this.materialId == '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
      this._siteAdminService.siteAdminScheduleVisitByDateTime(reqObj).subscribe(
        (res) => {
          this.notify.showNotification(
            'Appointment booked successfully',
            'top',
            'success'
          );
          if(this.modelContent === true){
            this.showBookedAppointment.emit();
            this._spinner.recepientIDSubject.next({status: 'load_seats'})
          } else {
            if(this.redirectAfterSave.trim() !=''){
              this._router.navigate([this.redirectAfterSave]);
            }
            
          }
  
  
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }


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

  ngOnDestroy() {
    this.serviceSubscription.forEach(element => {
      element.unsubscribe();
    });
  }

  getSelectedSiteName(event) {
    localStorage.setItem('selectedSiteId', event.value);
    this.selectedSiteId = event.value;

    this.providerSiteAdmin = event.value;
    this.dateSlot = null;
    this.checkSlotAppioment(this.minDate, { siteId: this.selectedSiteId });
    this.getSlotList()
  }
}
