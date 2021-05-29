import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-get-vaccinate-near-location',
  templateUrl: './component-get-vaccinate-near-location.component.html',
  styleUrls: ['./component-get-vaccinate-near-location.component.scss']
})
export class ComponentGetVaccinateNearLocationComponent implements OnInit {
  distanceMiles: number = 100;
  constructor() { }

  ngOnInit(): void {
  }

}
