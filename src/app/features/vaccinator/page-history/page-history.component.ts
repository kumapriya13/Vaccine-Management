import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { VaccinatorService } from '../../../core';

@Component({
  selector: 'app-page-history',
  templateUrl: './page-history.component.html',
  styleUrls: ['./page-history.component.scss'],
})
export class PageHistoryComponent implements OnInit {
  historyList: any;
  constructor(
    private _location: Location,
    private vaccinatorService: VaccinatorService
  ) {
    this.historyList=[];
  }

  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {
    this.getDailySiteVaccinationReport();
  }

  getDailySiteVaccinationReport() {
    let dateObj = new Date();
    let year = dateObj.getFullYear();
    let month: any = dateObj.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let date: any = dateObj.getDate();

    let reqData = {
      site_id: '',
      date: String(year + '-' + month + '-' + date),
    };

    this.vaccinatorService
      .reportingDailySiteVaccinationReport(reqData)
      .subscribe(
        (res) => {
          console.log(res);
          this.historyList=res;
          console.log("this.historyListgasgdg", this.historyList[0].VaccinationDetails.PATIENT_FIRST_NAME);
          console.log("this.historyList",this.historyList);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  // filterList(searchInput, all) {
  //   console.log('Filter text : ' + searchInput.value);
  //   if (!all) this.getVisits(searchInput.value);
  //   else if (searchInput.value.trim() == '' && all) this.getVisits('');
  // }
}
