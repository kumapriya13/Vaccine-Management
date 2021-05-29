import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentCommonModelComponent } from 'src/app/shared/components/component-common-model/component-common-model.component';

import { VaccinatorService,AdminService, AuthManageService } from '../../../core';
declare var $: any;
@Component({
  selector: 'app-page-schedule',
  templateUrl: './page-schedule.component.html',
  styleUrls: ['./page-schedule.component.scss'],
})
export class PageScheduleComponent implements OnInit {
  premiumData: any[] = [];
  paginateData: any[] = [];
  sites = [];
  selectedSiteId: string='';

  @ViewChild(ComponentCommonModelComponent) modelComponent : ComponentCommonModelComponent
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
  pageSize = 4;
  totalCount = 0;
  pageIndex = 1;
  pageLength = 10;
  collectionSize = 0;
  todayDate = new Date();
  selectedOption: string = '';
  vaccinatorDetails: any = {};
  checkListForm: any;
  searchInput: string="";
  stopCall:boolean =false
  constructor(
    private vaccinatorService: VaccinatorService,
    private _router: Router,
    private _spinner: SpinnerService,
    private adminService : AdminService,
    private modalService: NgbModal,
    private authManageService: AuthManageService  
  ) {}
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

  ngOnInit(): void {
    this.vaccinatorDetails = this.vaccinatorService.localStorage_getVaccinatorInfo();
    // console.log(this.vaccinatorDetails);
    if (!this.vaccinatorDetails) {
      this.vaccinatorService.getVaccinatorInfo().subscribe(
        (res: any) => {
          this.vaccinatorDetails = res;
          // console.log('res================', res);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    this.sites = this.authManageService.getLoggedInUser()?.sites;
    if(!localStorage.getItem('selectedSiteId')){
      localStorage.setItem('selectedSiteId', this.sites[0].site_id);    
    }

    this.selectedSiteId = localStorage.getItem('selectedSiteId');

    this.getVisits('', 1);
    this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];

    if(localStorage.getItem('qrscan')){
      let data = { name:'Checked-in'}
      this.tabActive(data);
      localStorage.removeItem('qrscan');
      localStorage.removeItem('recipientInQRScan');      
     }
  }
  getVisits(ticket_number, page) {
    // console.log("filter",ticket_number,page);
    this._spinner.showLoader();
    this.vaccinatorService.getVaccinatorVisits(ticket_number, page).subscribe(
      //this.vaccinatorService.getVisits().subscribe(
      (res: any) => {
        this._spinner.hideLoader();
        if (res.hasOwnProperty('checkedIn')) {
          // console.log('checkedInList=======', res.checkedIn);
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
          // console.log('completedResponse=======', res.completed);
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
          // console.log('initiatedResponse=======', res.initiated);
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
          // console.log('missedResponse=======', res.missed);
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
          // console.log('observationResponse=======', res.observation);
          //this.upcomingResponse = res.upcoming;
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
          // console.log('upcomingResponse=======', res.upcoming);
          //this.upcomingResponse = res.upcoming;
          this.upcomingList = res.upcoming.results ? res.upcoming.results : [];
          this.tabs.map((d) => {
            if (d.daytakey == 'upcoming') {
              d.total = res.upcoming.results
                ? res.upcoming.resultMetadata.count
                : 0;
            }
          });
          this.currentTab = this.tabs.filter((d) => d.status == 'active')[0];
        }
        // this.checkedInResponse = res.checkedIn;
        // this.completedResponse = res.completed;
        // this.initiatedResponse = res.initiated;
        // this.missedResponse = res.missed;
        // this.observationResponse = res.observation;
        // this.upcomingResponse = res.upcoming;
        // console.log(
        //   'this.upcomingResponse.results',
        //   this.upcomingResponse.results
        // );
        // this.checkedInList = this.checkedInResponse.results
        //   ? this.checkedInResponse.results
        //   : [];
        // this.completedList = this.completedResponse.results
        //   ? this.completedResponse.results
        //   : [];
        // this.initiatedList = this.initiatedResponse.results
        //   ? this.initiatedResponse.results
        //   : [];
        // this.missedList = this.missedResponse.results
        //   ? this.missedResponse.results
        //   : [];
        // this.observationList = this.observationResponse.results
        //   ? this.observationResponse.results
        //   : [];
        // // this.upcomingList = this.upcomingResponse.results
        //   ? this.upcomingResponse.results
        //   : [];
        // console.log('this.upcomingList', this.upcomingList.length);
        if (this.checkedInList.id_validation == true) {
          $('#exampleModal1').modal('hide');
        }
        if (
          this.checkedInList.id_validation == false ||
          this.checkedInList.id_validation == ''
        ) {
          $('#exampleModal1').modal('show');
        }
        // console.log(res);
      },
      (err) => {
        this._spinner.hideLoader();
        console.log(err);
      }
    );
  }

  onPageChange(pageIndex) {
    //alert(pageIndex)
    this.pageIndex = pageIndex;
    let reqObj = {
      pageIndex: pageIndex,
      pageLength: this.pageLength,
    };
    this._spinner.showLoader();
    this.getVisits(this.searchInput, pageIndex);
  }

  setVisitRowToLocalStorage(visitRow: any, id: any, type: any, isValidated:boolean = false) {
    //  alert('hi');
    
    this.currentVisitRow = visitRow;
     console.log('visitRow', type,this.stopCall,visitRow);
     localStorage.setItem('vaccinator-visit', JSON.stringify(visitRow));
     //&& this.stopCall
    if (type != '') {
      this._router.navigate(['/vaccinator/checklist', id, type,isValidated]);
    }else{
      this.stopCall = true
    }

    // [routerLink]="['/vaccinator/checklist', upcomingListItem.id, 'upcoming']"
  }

  setVisitRowToLocalStorageForObservation(observationItem: any) {
    // console.log(observationItem);

    let observationVisiterInfoObj = {
      id: observationItem.id,
      startTime: moment(observationItem.time_of_administration),
      timeIntervalInSec: moment(observationItem.observation_end_time).diff(
        observationItem.time_of_administration,
        's'
      ),
    };

    observationItem['observationVisiterInfoObj'] = observationVisiterInfoObj;
    // console.log(observationVisiterInfoObj);
    window.localStorage.setItem(
      'vaccinator-visit-' + observationItem.id,
      JSON.stringify(observationItem)
    );

    this._router.navigate([
      '/vaccinator/recepient',
      observationItem.id,
      'observation',
    ]);
  }

  filterList(searchInput, all) {
    this.pageIndex = 1;
    if(this.searchInput.toString().trim().length > 0){
      // console.log("inside filter with val");
      this.getVisits(this.searchInput, this.pageIndex);
    } else {
      // console.log("inside filter without val");
      this.getVisits(this.searchInput, this.pageIndex);
    }
    // console.log('Filter text : ' + searchInput);
    // if (!all) this.getVisits(searchInput, 1);
    // else if (searchInput.trim() == '' && all) this.getVisits('', 1);
  }

  identificationData(routing: string, visitid: string, types: string) {
    let req = {
      id: visitid,
      id_validation_type: this.selectedOption,
      id_validation: true,
      time_of_checkin: moment(),
    };
    // checkInVisitStatus() {
    // let reqData = {
    //   "id": this.visitId,

    // }

    this.vaccinatorService.checkInVisitStatus(req).subscribe(
      (res) => {
        this._router.navigate([routing, visitid, types]);
        // this.checkListForm.reset();
        // $("#exampleModal1").modal('show');
      },
      (err) => {
        this.checkListForm.reset();
        this._router.navigate(['/vaccinator/checklist']);
      }
    );
  }

  tabActive(data: any) {
    this.tabs.map((d) => (d.status = 'notactive'));
    //this.searchInput = "";
    for (let i = 0; i < this.tabs.length; i++) {
      // console.log('====', data.name, this.tabs[i].name);
      if (data.name == this.tabs[i].name) {
        this.tabs[i].status = 'active';
        this.currentTab = this.tabs[i];
        break;
      }
    }
  }

  checkIFBlankLoadData(searchInput, all) {
       if (searchInput.trim() == '' && all) 
          this.getVisits('', 1);
  }

  
  showAppointment(data,event,actionbyTab:any = {}){
    event.stopPropagation();
    console.log("2212",data);
    let actions: any = [{action : 'cancelappointment', status: false},{action: 'bookappointment', status: false}];
    if(actionbyTab.hasOwnProperty('action')){
      let findindex = actionbyTab.hasOwnProperty('action') ? actions.map((d) => d.action).indexOf(actionbyTab.action) : -1;
      if(findindex > -1){
        actions[findindex].status = actionbyTab.status;
      }
    } 
    console.log("2212",actions,actionbyTab);
     this.modelComponent.openHelpModel(data,actions)


  }

  siteChanged(val): void {
    localStorage.setItem('selectedSiteId', val);  
    this.selectedSiteId = val;
    setTimeout(() => {
     this.getVisits('', 1)
   }, 300);     
 }
}
