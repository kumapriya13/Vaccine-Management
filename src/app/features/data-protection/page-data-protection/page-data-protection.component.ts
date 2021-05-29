import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-data-protection',
  templateUrl: './page-data-protection.component.html',
  styleUrls: ['./page-data-protection.component.scss'],
})
export class PageDataProtectionComponent implements OnInit {
  constructor(private _location: Location) {}
  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {}
}
