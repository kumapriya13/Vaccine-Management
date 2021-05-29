import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService, VaccinatorService } from 'src/app/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-component-vaccinator-header',
  templateUrl: './component-vaccinator-header.component.html',
  styleUrls: ['./component-vaccinator-header.component.scss'],
})
export class ComponentVaccinatorHeaderComponent implements OnInit {
  vaccinatorDetails$: any;

  constructor(
    private _router: Router,
    private authManageService: AdminAuthService,
    private vs: VaccinatorService,
    private _location: Location,
  ) {}
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
    this.vaccinatorDetails$ = this.vs._userProfile;
  }

  logout() {
    this.authManageService.adminSignOut();
  }

  logo = environment.logoImg;
}
