import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-list-of-schedule-yes',
  templateUrl: './list-of-schedule-yes.component.html',
  styleUrls: ['./list-of-schedule-yes.component.scss']
})
export class ListOfScheduleYesComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }


  editdetails(){
   // this._router.navigate(['/site-admin/manage-calender/site-same-schedule']);

  }

}
