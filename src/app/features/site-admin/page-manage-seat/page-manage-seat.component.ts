import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-page-manage-seat',
  templateUrl: './page-manage-seat.component.html',
  styleUrls: ['./page-manage-seat.component.scss']
})
export class PageManageSeatComponent implements OnInit {

  constructor(private _location: Location) { }
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
  }

}
