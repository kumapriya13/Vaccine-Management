import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { SiteAdminService } from '../../../../core';

@Component({
  selector: 'app-page-vaccine-report',
  templateUrl: './page-vaccine-report.component.html',
  styleUrls: ['./page-vaccine-report.component.scss']
})
export class PageVaccineReportComponent implements OnInit {
  materialListNames: [];

  constructor( private _location: Location,
    private _siteAdminService: SiteAdminService,
    ) { }
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
this.getMaterialListNames()

  }
  getMaterialListNames() {
    this._siteAdminService.getMaterialListNames().subscribe(
      res => {
        this.materialListNames = res.results;
      }
    );
  }


}
