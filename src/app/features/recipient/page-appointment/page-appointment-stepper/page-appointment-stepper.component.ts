import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { zip } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { RecipientService, SiteService, UserService } from '../../../../core';

@Component({
  selector: 'app-page-appointment-stepper',
  templateUrl: './page-appointment-stepper.component.html',
  styleUrls: ['./page-appointment-stepper.component.scss'],
  providers: [
    {
      provide: MAT_STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class PageAppointmentStepperComponent implements OnInit, AfterViewInit {
  @Output() appointmentResult = new EventEmitter();

  @Input() recipient_ids: string[]; // Family member ids

  @ViewChild('stepper') myStepper: MatStepper;

  date: any = new Date();
  site: any = null;
  material: any = null;
  zip: any = null;
  distanceMiles: number = 100;

  dateSlotList: any[] = [];
  materialList: any[] = [];
  siteList: any[] = [];
  recipientVisit: any = {};
  selectedIndexFromEvent: number = 0;
  checkSlot: any[] = [];
stopCondition = true
  constructor(
    private _siteService: SiteService,
    private _recipientService: RecipientService,
    private _userService: UserService,
    private _NotificationService: NotificationService,
    private _spinner: SpinnerService
  ) { }

  ngAfterViewInit(): void {
    this.recipientVisit = this._userService.getRecipientVisitsTolocalStorageInAscendingByCreatedTime();
    this.selectedIndexFromEvent = this.myStepper.selectedIndex = parseInt(
      JSON.parse(localStorage.getItem('stepperNo'))
    );

  }

  ngOnInit(): void {
    this.getMaterialList();
  }

  changeDate(date: Date) {
    this.date = date;
    this.getDateSlotListBySearch();
  }

  changeMonth(date: Date) {
    this.checkSlotAppioment(date);
  }

  changeSite(site: any) {

    this.site = site;
    this.getDateSlotListBySearch();
    this.changeMonth(this.date);
    this.myStepper.selectedIndex = 1;
  }

  changeZip(zip: number) {
    
    this.zip = zip;
  }

  changeDistanceMiles(distanceMiles: number) {
    this.distanceMiles = distanceMiles;
  }

  searchTrigger() {
    this.getSiteListBySearch();
  }

  getMaterialList() {
    this._recipientService.materialListNames().subscribe((res) => {
      this.materialList = res;
    });
  }

  changeMaterial(material) {
    this.material = material;
    this.getSiteListBySearch();
  }

  getSiteListBySearch() {
    if (!this.zip) return;
    let reqObj = {
      zipCode: this.zip,
      availableVisitsOnly: true,
      distanceMiles: Number(this.distanceMiles),
      vaccineList: !!this.material ? [this.material['id']] : [],
      page: 1,
      pageLength: 100
    };

    if (this.myStepper && this.myStepper.selectedIndex == 0) {
      this._siteService.getSiteBySearch(reqObj).subscribe(
        (res: any) => {
          this.siteList = res['results'];
          if (this.siteList['length'] == 0)
            return this._NotificationService.showNotification(
              'Sites Not Found',
              'top',
              'error'
            );
        },
        (err) => {
          this.siteList = [];
          return this._NotificationService.showNotification(
            'Enter Valid Zipcode',
            'top',
            'error'
          );
          console.log(err);
        }
      );
    }
  }

  changeMaterialAndGetBookSlot(material) {
    
    this.material = material;
    this.getDateSlotListBySearch();
  }

  checkSlotAppioment(date: Date) {
    
    if (!this.site) return;
    let reqObj = {
      siteId: this.site.id,
      yearMonth: moment(date).format('YYYY-MM'),
    };

    this._spinner.showLoader();
    this._siteService.checkSlotDate(reqObj).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.checkSlot = res;
      },
      (err) => {
        this._spinner.hideLoader();
        console.log(err);
      }
    );
  }

  getDateSlotListBySearch() {
    
    if (!this.site) return;
    if (!this.material) return;

    let reqObj = {
      siteId: this.site.id,
      materialId: this.material.id,
      slotDate: moment(this.date).format('YYYY-MM-DD'),
    };

    this._siteService.slotAvailableValues(reqObj).subscribe(
      (res) => {
        // console.log(res.results);
        this.dateSlotList = res.results;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  reqBookAppointment(data: any) {
    
    this._spinner.showLoader();

    let reqData;

    if (this.recipient_ids) {
      reqData = {
        siteId: this.site.id,
        startDateTime: data.dateSlot.start_time,
        endDateTime: data.dateSlot.end_time,
        materialId: data.material.id,
        recipientIds: this.recipient_ids,
      };
    } else {
      reqData = {
        site_id: this.site.id,
        startDateTime: data.dateSlot.start_time,
        endDateTime: data.dateSlot.end_time,
        material_id: data.material.id,
      };
    }

    const call = this.recipient_ids ?
      this._siteService.scheduleFamilyMembersSlots(reqData) :
      this._siteService.siteScheduleVisitByDateTime(reqData);

    call.subscribe(
      (res: any) => {
        if (res.status == "success") {
          this._NotificationService.showNotification(
            'Appointment booked successfully',
            'top',
            'success'
          );

        }
        if (!this.recipient_ids) {
          this.reLoadRecipientVisits();
        }
        this._spinner.hideLoader();
        this.appointmentResult.emit(res);
      },
      (err) => {
        this._NotificationService.showNotification(
          `We couldn't book your appointment`,
          'top',
          'error'
        );
        this._spinner.hideLoader();
        this.appointmentResult.emit(err);
      }
    );
  }

  reLoadRecipientVisits() {
    this._userService.getRecipientVisits().subscribe(
      (res) => {
        this.recipientVisit = this._userService.setRecipientVisitsTolocalStorage(
          res
        );
        this.recipientVisit = res;
        if (res.results.length > 0) {
          this.myStepper.selectedIndex = 2;
          this.myStepper.next();
          localStorage.setItem('stepperNo', JSON.stringify(2));
        } else {
          this.getSiteListBySearch()
          this.myStepper.selectedIndex = 0;
          localStorage.setItem('stepperNo', JSON.stringify(0));
        }
      },
      (err) => { }
    );
  }

  cancleAppointment(visitObj) {
    this.material = null;
    this.dateSlotList = [];
    let reqData = {
      visit_id: visitObj.id,
    };

    this._siteService.siteCancelVisit(reqData).subscribe(
      (res: any) => {
        this.reLoadRecipientVisits();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeVaccination() {
    this.myStepper.selectedIndex = 0;
  }

  onStepChange(event: any): void {


    localStorage.setItem('stepperNo', event.selectedIndex);
    if (this.recipient_ids) {
      return;
    }

    if (event.selectedIndex == 0 && this.stopCondition) {
      this.stopCondition = false
      this.myStepper.selectedIndex =  event.selectedIndex;
      this.getSiteListBySearch()
      // return
    }

    let checkIfAllComOrObser = false;
    // recipientVisitItem.$expanded.no_of_doses_in_series
    if (this.recipientVisit['results'].length > 0) {
      let no_of_doses_in_series = this.recipientVisit['results'][0].$expanded
        .no_of_doses_in_series;

      checkIfAllComOrObser =
        this.recipientVisit['results'].length >= no_of_doses_in_series
          ? this.recipientVisit['results'][no_of_doses_in_series - 1][
          'visit_status'
          ] == 'completed' ||
          this.recipientVisit['results'][no_of_doses_in_series - 1][
          'visit_status'
          ] == 'observation'
          : false;
    }

    if (checkIfAllComOrObser && event.selectedIndex == 3) {
      checkIfAllComOrObser = false;
    }

    if (
      (this.recipientVisit['results'].length > 0 &&
        event.selectedIndex <= 1 &&
        this.recipientVisit['results'][0]['visit_status'] != 'completed') ||
      checkIfAllComOrObser
    ) {
      setTimeout(() => {
        this.selectedIndexFromEvent = this.myStepper.selectedIndex = 2;
      }, 300);
    } else {
      this.selectedIndexFromEvent = event.selectedIndex;
      if (this.selectedIndexFromEvent == 1) {
        this.checkSlotAppioment(this.date);
      }
    }
  }

  checkCertificateVisible(): boolean {
    if (this.recipientVisit['results'].length > 0) {
      let no_of_doses_in_series = this.recipientVisit['results'][0].$expanded
        .no_of_doses_in_series;
      if (this.recipientVisit['results'].length == no_of_doses_in_series) {
        return this.recipientVisit['results'][0][
          'visit_status'
        ] == 'completed' && this.recipientVisit['results'][0][
        'dose_in_series'
        ] == no_of_doses_in_series
          ? true
          : false;
      }
    }
    return false;
  }
}
