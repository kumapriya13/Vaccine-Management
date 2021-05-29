import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-privacy-policy',
  templateUrl: './page-privacy-policy.component.html',
  styleUrls: ['./page-privacy-policy.component.scss'],
})
export class PagePrivacyPolicyComponent implements OnInit {
  constructor(private _location: Location) {}
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {}
}
