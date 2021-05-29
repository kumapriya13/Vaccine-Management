import { Component, OnInit } from '@angular/core';

import { VaccinatorService } from '../../../core';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent implements OnInit {
  title = '';
  vaccinatorDetails: any = {};
  siteInfo: any = {};

  constructor(private vaccinatorService: VaccinatorService) {}

  ngOnInit() {
    this.vaccinatorService.getVaccinatorInfo().subscribe(
      (res: any) => {
        this.vaccinatorDetails = res;
        this.getSiteInfo();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getSiteInfo() {
    console.log(this.vaccinatorDetails);
    const siteId = this.vaccinatorDetails.site_ids[0];
    this.vaccinatorService.getSiteInfo(siteId).subscribe(
      (res) => {
        this.siteInfo = res;
      },
      (err) => alert('Something went wrong')
    );
  }
}
