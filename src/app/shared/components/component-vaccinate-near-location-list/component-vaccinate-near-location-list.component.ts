import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-vaccinate-near-location-list',
  templateUrl: './component-vaccinate-near-location-list.component.html',
  styleUrls: ['./component-vaccinate-near-location-list.component.scss']
})
export class ComponentVaccinateNearLocationListComponent implements OnInit {

  vaccineList = [1,2,3,4,5,6]
  constructor() { }

  ngOnInit(): void {
  }

}
