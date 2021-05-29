import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { VaccinatorService } from 'src/app/core';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { PageDashboardComponent } from '../page-dashboard.component';
declare var $: any;

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {

  premiumData: any[] = [];
  paginateData: any[] = [];
  tabs: any = [
    {
      name: 'Missed',
      daytakey: 'missed',
      status: 'notactive',
      total: '0',
      href: 'missed',
      data: [],
    },
    {
      name: 'Upcoming',
      daytakey: 'upcoming',
      status: 'notactive',
      total: '0',
      href: 'upcoming',
      data: [],
    },
    {
      name: 'Checked-in',
      daytakey: 'checkedIn',
      status: 'active',
      total: '0',
      href: 'checkedin',
      data: [],
    },
    {
      name: 'Observation',
      daytakey: 'observation',
      status: 'notactive',
      total: '0',
      href: 'observation',
      data: [],
    },
    {
      name: 'Completed',
      daytakey: 'completed',
      status: 'notactive',
      total: '0',
      href: 'completed',
      data: [],
    },
  ];
  currentTab: any;
  page = 1;
  pageSize = 10;
  totalCount = 0;
  pageIndex = 1;
  pageLength = 10;
  collectionSize = 0;
  selectedDate = new Date();
  todayDate = new Date();
  selectedOption: string = '';
  vaccinatorDetails: any = {};
  checkListForm: any;
  searchInput: string = '';
  stopCall: boolean = false
  dontMoveIfHistory: boolean = false;

  constructor(
    private vaccinatorService: VaccinatorService,
    private _router: Router,
    private _spinner: SpinnerService,
    private datePipe: DatePipe,
    private dashboardComponent: PageDashboardComponent
  ) { }

  visits: any[] = [];
  visitsReponse: any = {};

  // response List Array
  checkedInResponse: any = null;
  completedResponse: any = null;
  initiatedResponse: any = null;
  missedResponse: any = null;
  observationResponse: any = null;
  upcomingResponse: any = [];

  // response List Array
  checkedInList: any = [];
  completedList: any = [];
  initiatedList: any = [];
  missedList: any = [];
  observationList: any = [];
  upcomingList: any = [];
  currentVisitRow: any = {};
  date2 = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  // ********** payload for appointment ************
  payload = {
    startDate: this.date2,
  };

  get date(): Date {
    return this.dashboardComponent.selectedDate;
  }

  set date(date: Date) {
    this.dashboardComponent.selectedDate = date;
  }

  ngOnInit(): void {

    this.vaccinatorDetails =
      this.vaccinatorService.localStorage_getVaccinatorInfo();
    if (!this.vaccinatorDetails) {
      this.vaccinatorService.getVaccinatorInfo().subscribe(
        (res: any) => {
          this.vaccinatorDetails = res;
        },
        (err) => {
          console.log(err);
        }
      );
    }
    this.getVisits('', 1);
    this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];

    if (localStorage.getItem('qrscan')) {
      let data = { name: 'Checked-in' };
      this.tabActive(data);
      localStorage.removeItem('qrscan');
      localStorage.removeItem('recipientInQRScan');
    }
  }
  getVisits(ticket_number, page, selectedDate = null) {
    this._spinner.showLoader();
    this.vaccinatorService
      .getVaccinatorVisits(ticket_number, page, selectedDate)
      .subscribe(
        (res: any) => {
          this._spinner.hideLoader();
          if (res.hasOwnProperty('checkedIn')) {
            this.checkedInList = res.checkedIn.results
              ? res.checkedIn.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'checkedIn') {
                d.total = res.checkedIn.results
                  ? res.checkedIn.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('completed')) {
            this.completedList = res.completed.results
              ? res.completed.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'completed') {
                d.total = res.completed.results
                  ? res.completed.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('initiated')) {
            this.initiatedList = res.initiated.results
              ? res.initiated.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'initiated') {
                d.total = res.initiated.results
                  ? res.initiated.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('missed')) {
            this.missedList = res.missed.results ? res.missed.results : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'missed') {
                d.total = res.missed.results
                  ? res.missed.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('observation')) {
            this.observationList = res.observation.results
              ? res.observation.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'observation') {
                d.total = res.observation.results
                  ? res.observation.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('upcoming')) {
            this.upcomingList = res.upcoming.results
              ? res.upcoming.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'upcoming') {
                d.total = res.upcoming.results
                  ? res.upcoming.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (this.checkedInList.id_validation == true) {
            $('#exampleModal1').modal('hide');
          }
          if (
            this.checkedInList.id_validation == false ||
            this.checkedInList.id_validation == ''
          ) {
            $('#exampleModal1').modal('show');
          }
        },
        (err) => {
          this._spinner.hideLoader();
          console.log(err);
        }
      );
  }

  onPageChange(pageIndex) {

    this.pageIndex = pageIndex;
    let reqObj = {
      pageIndex: pageIndex,
      pageLength: this.pageLength,
    };
    this._spinner.showLoader();
    this.getVisits(this.searchInput, pageIndex, this.selectedDate);
  }



  setVisitRowToLocalStorage(visitRow: any, id: any, type: any, isValidated: boolean = false) {
    //event.stopPropagation();
    this.currentVisitRow = visitRow;
    localStorage.setItem('vaccinator-visit', JSON.stringify(visitRow));
    //&& this.stopCall
    if (type != '') {
      this._router.navigate(['/vaccinator/checklist', id, type, isValidated]);
    } else {
      this.stopCall = true
    }

    // [routerLink]="['/vaccinator/checklist', upcomingListItem.id, 'upcoming']"
  }

  // setVisitRowToLocalStorage(
  //   visitRow: any,
  //   id: any,
  //   type: any,
  //   isValidated: boolean = false
  // ) {
  //   this.currentVisitRow = visitRow;
  //   localStorage.setItem('vaccinator-visit', JSON.stringify(visitRow));
  //   // if (type != '') {
  //   //   this._router.navigate([
  //   //     '/site-admin/dashboard/schedule',
  //   //     id,
  //   //     type,
  //   //     isValidated,
  //   //   ]);
  //   // }
  // }

  setVisitRowToLocalStorageForObservation(observationItem: any) {
    // console.log(observationItem);
    // let observationVisiterInfoObj = {
    //   id: observationItem.id,
    //   startTime: moment(observationItem.time_of_administration),
    //   timeIntervalInSec: moment(observationItem.observation_end_time).diff(
    //     observationItem.time_of_administration,
    //     's'
    //   ),
    // };
    // observationItem['observationVisiterInfoObj'] = observationVisiterInfoObj;
    // window.localStorage.setItem(
    //   'vaccinator-visit-' + observationItem.id,
    //   JSON.stringify(observationItem)
    // );
    // this._router.navigate([
    //   '/vaccinator/recepient',
    //   observationItem.id,
    //   'observation',
    // ]);
  }

  filterList(searchInput, all) {
    this.pageIndex = 1;
    if (this.searchInput.toString().trim().length > 0) {
      this.getVisits(this.searchInput, this.pageIndex, this.selectedDate);
    } else {
      this.getVisits(this.searchInput, this.pageIndex, this.selectedDate);
    }
  }

  identificationData(visitid: string, types: string) {
    this._spinner.showLoader();
    let req = {
      id: visitid,
      id_validation_type: this.selectedOption,
      id_validation: true,
      time_of_checkin: moment(),
    };

    this.vaccinatorService.checkInVisitStatus(req).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.selectedOption = "";
        //this._router.navigate([routing, visitid, types]);
        //this._router.navigate(['/site-admin/dashboard/schedule']);
        this.getVisits(this.searchInput, this.pageIndex, this.selectedDate)
        //window.location.reload();

      },
      (err) => {
        this._spinner.hideLoader();
        this.selectedOption = "";
        //this._router.navigate(['/site-admin/dashboard/schedule']);
        //window.location.reload();
      }
    );
  }

  tabActive(data: any) {
    this.tabs.map((d) => (d.status = 'notactive'));
    this.pageIndex = 1;
    this.onPageChange(this.pageIndex)

    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    let selectedDate = new Date(this.selectedDate);
    selectedDate.setHours(0, 0, 0, 0);
    let checks = selectedDate.getTime() < currentDate.getTime() || selectedDate.getTime() > currentDate.getTime()
    if (checks) {
      this.dontMoveIfHistory = true;
    } else {
      this.dontMoveIfHistory = false;
    }

    for (let i = 0; i < this.tabs.length; i++) {
      if (data.name == this.tabs[i].name) {
        this.tabs[i].status = 'active';
        this.currentTab = this.tabs[i];
        break;
      }
    }
  }

  checkIFBlankLoadData(searchInput, all) {
    if (searchInput.trim() == '' && all) this.getVisits('', 1);
  }

  dateChange(ticket_number, page, event: any) {
    // ************* Date filter event  *************
    this._spinner.showLoader();
    this.selectedDate = event.value;
    this.payload.startDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    // this.getVisits(ticket_number, page);
    this.vaccinatorService
      .getVaccinatorVisitsPrevieus('', this.page, this.payload.startDate)
      .subscribe(
        (res: any) => {
          this._spinner.hideLoader();
          if (res.hasOwnProperty('checkedIn')) {
            this.checkedInList = res.checkedIn.results
              ? res.checkedIn.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'checkedIn') {
                d.total = res.checkedIn.results
                  ? res.checkedIn.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('completed')) {
            this.completedList = res.completed.results
              ? res.completed.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'completed') {
                d.total = res.completed.results
                  ? res.completed.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('initiated')) {
            this.initiatedList = res.initiated.results
              ? res.initiated.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'initiated') {
                d.total = res.initiated.results
                  ? res.initiated.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('missed')) {
            this.missedList = res.missed.results ? res.missed.results : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'missed') {
                d.total = res.missed.results
                  ? res.missed.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('observation')) {
            this.observationList = res.observation.results
              ? res.observation.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'observation') {
                d.total = res.observation.results
                  ? res.observation.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (res.hasOwnProperty('upcoming')) {
            this.upcomingList = res.upcoming.results
              ? res.upcoming.results
              : [];
            this.tabs.map((d) => {
              if (d.daytakey == 'upcoming') {
                d.total = res.upcoming.results
                  ? res.upcoming.resultMetadata.count
                  : 0;
              }
            });
            this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
          }
          if (this.checkedInList.id_validation == true) {
            $('#exampleModal1').modal('hide');
          }
          if (
            this.checkedInList.id_validation == false ||
            this.checkedInList.id_validation == ''
          ) {
            $('#exampleModal1').modal('show');
          }
        },
        (err) => {
          this._spinner.hideLoader();
          console.log(err);
        }
      );
  }
}
