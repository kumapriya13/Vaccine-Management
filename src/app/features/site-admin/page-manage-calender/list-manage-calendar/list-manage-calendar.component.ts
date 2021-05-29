import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-manage-calendar',
  templateUrl: './list-manage-calendar.component.html',
  styleUrls: ['./list-manage-calendar.component.scss']
})
export class ListManageCalendarComponent implements OnInit {
  listOfSchedule: number[] = [1,2,3,4,5,6]
  constructor() { }

  ngOnInit(): void {
  }

}
