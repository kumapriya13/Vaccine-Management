import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-manage-calendar',
  templateUrl: './site-manage-calendar.component.html',
  styleUrls: ['./site-manage-calendar.component.scss']
})
export class SiteManageCalendarComponent implements OnInit {

  checked = false;
   showsite:boolean = true;
  flag: any;

  days: string[] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  seats:string[]=['Seat1','Seat2','Seat3','Seat4','Seat5']
  selectedDays: string[] = [];

  panelOpenState = false;

  constructor(
    private _router: Router,
  ) {
 
    this.flag = 0;
  
   }   
   
  ngOnInit(): void {
  }

  OnToggleChanged(selectedDay: string[]){
    this.selectedDays = selectedDay;
  }

  listData(){
    this._router.navigate(['/site-admin/manage-calender/list-of-schedule-yes']);
  }
  
}
