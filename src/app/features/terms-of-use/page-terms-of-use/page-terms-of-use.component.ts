import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-terms-of-use',
  templateUrl: './page-terms-of-use.component.html',
  styleUrls: ['./page-terms-of-use.component.scss'],
})
export class PageTermsOfUseComponent implements OnInit {
  constructor(private _location: Location) {}
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {}
}
