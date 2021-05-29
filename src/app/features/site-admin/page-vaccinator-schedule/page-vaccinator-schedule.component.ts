import { Component, OnInit } from '@angular/core';

import { SiteAdminService } from '../../../core';

@Component({
  selector: 'app-page-vaccinator-schedule',
  templateUrl: './page-vaccinator-schedule.component.html',
  styleUrls: ['./page-vaccinator-schedule.component.scss']
})

export class PageVaccinatorScheduleComponent implements OnInit {
  todayDate = new Date();
  selectedOption: string = '';
  vaccinatorDetails: any = {};

  constructor(private _siteAdminService : SiteAdminService ) {}

  visits: any[] = [];
  visitsReponse: any = {};
  seatSelected:string;
  vaccinatorSelected:string;

  // response List Array
  checkedInResponse: any = null;
  completedResponse: any = null;
  initiatedResponse: any = null;
  missedResponse: any = null;
  observationResponse: any = null;
  upcomingResponse: any = null;

  // response List Array
  checkedInList: any = [];
  completedList: any = [];
  initiatedList: any = [];
  missedList: any = [];
  observationList: any = [];
  upcomingList: any = [];
  upcomingListTemp: any = [];
  checkedInListTemp: any = [];
  observationListTemp: any = [];
  completedListTemp: any = [];
  currentVisitRow: any = {};
  ticket_number:string='';

  seatsList:any=["Seat1","Seat2","Seat3"];
  vaccinatorsList:any=[];

  ngOnInit(): void {
    this.seatSelected="select";
    this.vaccinatorDetails = this._siteAdminService.localStorage_getVaccinatorInfo();

   // console.log(this.vaccinatorDetails);
    if (!this.vaccinatorDetails) {
      this._siteAdminService.getVaccinatorInfo().subscribe(
        (res: any) => {
          this.vaccinatorDetails = res;
        //  console.log(res);
        },
        (err) => {
         // console.log(err)
        }
      );
    }
    this.getVisits('');
  }

getVisits(ticket_number){
   this._siteAdminService.getVaccinatorVisits(ticket_number).subscribe(
    (res: any) => {
        this.checkedInResponse = res.checkedIn;
        this.completedResponse = res.completed;
        this.initiatedResponse = res.initiated;
        this.missedResponse = res.missed;
        this.observationResponse = res.observation;
        this.upcomingResponse = res.upcoming;
       // console.log('this.upcomingResponse.results', this.upcomingResponse.results);


        this.checkedInList = this.checkedInResponse.results ? this.checkedInResponse.results : [];
        this.completedList = this.completedResponse.results ? this.completedResponse.results : [];
        this.initiatedList = this.initiatedResponse.results ? this.initiatedResponse.results : [];
        this.missedList = this.missedResponse.results ? this.missedResponse.results : [];
        this.observationList = this.observationResponse.results ? this.observationResponse.results : [];

        this.upcomingList = this.upcomingResponse.results ? this.upcomingResponse.results : [];
        this.upcomingListTemp = this.upcomingResponse.results ? this.upcomingResponse.results : [];
        this.observationListTemp = this.observationResponse.results ? this.observationResponse.results : [];
        this.checkedInListTemp = this.checkedInResponse.results ? this.checkedInResponse.results : [];
        this.completedListTemp = this.completedResponse.results ? this.completedResponse.results : [];


        //console.log('this.upcomingList', this.upcomingList.length);
       // console.log(res);
        this.getSeats();
        //seatsList
        },
         (err) => {
          console.log(err)
        }
       );
  }//visits


  setVisitRowToLocalStorage(visitRow: any) {
    this.currentVisitRow = visitRow;
    window.localStorage.setItem('vaccinator-visit', JSON.stringify(visitRow));
  }

  filterChange(seat,vacinator){
      if(seat.value == 'select' && vacinator.value=='select'){
        this.upcomingList    = this.upcomingListTemp;
        this.observationList = this.observationListTemp;
        this.checkedInList   = this.checkedInListTemp;
        this.completedList   = this.completedListTemp;
      }else{
        this.upcomingList =  this.upcomingListTemp.filter(function(obj) {
            if(seat.value !== 'select' && vacinator.value !=='select')
                return (obj.$expanded.seat_name == seat.value && obj.$expanded.vaccinator_name == vacinator.value);
            else if (seat.value != 'select')
                return (obj.$expanded.seat_name == seat.value);
            else if(vacinator.value !='select')
                return (obj.$expanded.vaccinator_name == vacinator.value);

        });

        this.observationList =  this.observationListTemp.filter(function(obj) {
            if(seat.value !== 'select' && vacinator.value !=='select')
                return (obj.$expanded.seat_name == seat.value && obj.$expanded.vaccinator_name == vacinator.value);
            else if (seat.value != 'select')
                return (obj.$expanded.seat_name == seat.value);
            else if(vacinator.value !='select')
                return (obj.$expanded.vaccinator_name == vacinator.value);

        });

        this.checkedInList =  this.checkedInListTemp.filter(function(obj) {
            if(seat.value !== 'select' && vacinator.value !=='select')
                return (obj.$expanded.seat_name == seat.value && obj.$expanded.vaccinator_name == vacinator.value);
            else if (seat.value != 'select')
                return (obj.$expanded.seat_name == seat.value);
            else if(vacinator.value !='select')
                return (obj.$expanded.vaccinator_name == vacinator.value);

        });

        this.completedList =  this.completedListTemp.filter(function(obj) {
            if(seat.value !== 'select' && vacinator.value !=='select')
                return (obj.$expanded.seat_name == seat.value && obj.$expanded.vaccinator_name == vacinator.value);
            else if (seat.value != 'select')
                return (obj.$expanded.seat_name == seat.value);
            else if(vacinator.value !='select')
                return (obj.$expanded.vaccinator_name == vacinator.value);
        });
      }

  }

  getSeats(){
    const pushIfUnique = (predicate, object, array) => {
        if (!array.find(item => predicate(object, item))) {
          array.push(object);
        }
      };

      for(let x of this.upcomingList){
            this.seatsList.push(x.$expanded.seat_name);
      }
      for(let x of this.observationList){
            this.seatsList.push(x.$expanded.seat_name);
      }
      for(let x of this.checkedInList){
            this.seatsList.push(x.$expanded.seat_name);
      }
      for(let x of this.completedList){
            this.seatsList.push(x.$expanded.seat_name);
      }
      let unique = this.seatsList.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })

      //console.log(this.seatsList +", Unique :" +unique);
      this.seatsList = unique;
  }

  filterList(ele,all){
   // console.log("Filter text : "+ele.value);
    if(!all)
        this.getVisits(ele.value);
    else if(ele.value.trim()=='' && all)
         this.getVisits('');
  }
}
