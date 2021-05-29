import { AuthManageService } from 'src/app/core';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../../core';
import { SpinnerService } from 'src/app/core/services/spinner.service';

export interface PeriodicElement {
  material_name: string,
  no_of_doses_in_batch: string,
  expected_availability_date: string,
  expiry_date: string,
  material_no_of_doses_per_vial: string,
  no_of_vials: string,


  id: string
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-page-list-vaccine',
  templateUrl: './page-list-vaccine.component.html',
  styleUrls: ['./page-list-vaccine.component.scss'],
})
export class PageListVaccineComponent implements OnInit {
  site_ids: any[];
  displayedColumns: string[] = [
    "batch_no",
    "material_name",
    "no_of_doses_in_batch",
    "material_no_of_doses_per_vial",
    "no_of_vials",
    "doses_consumed",
    "expected_availability_date",
    "expiry_date",
    "id"
  ];

  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  vaccineDataSource: any[] = [];
  seatData: any;
  searchText: string = '';

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currntdate: string;

  constructor(
    private _siteAdminService: SiteAdminService,
    private authManageService: AuthManageService,
    private notify: NotificationService,
    private _router: Router,
    private _location: Location,
    private _spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.site_ids = this.authManageService.getLoggedInUser()['site_ids'];
    this.loadVaccineList(this.pageIndex + 1, this.pageSize, this.searchText);

    this.currntdate= moment(new Date()).format('MM-DD-yyyy')

  }

  backClicked() {
    this._location.back();
  }

  loadVaccineList(pageIndex: number, pageSize: number, searchText: string) {
    let reqObj = {
      site_id: this.site_ids[0],
      page: pageIndex,
      pageLength: pageSize,
      q: searchText
    };
    this._spinner.showLoader();
    this._siteAdminService.getMaterialList(reqObj).subscribe(
      (res) => {
        this._spinner.hideLoader();
        // console.log(res.results);
        this.vaccineDataSource = res.results;
        this.mapTableData();
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page - 1;
      },
      (err) => {
        this._spinner.hideLoader();
        //console.log(err);
      }
    );
  }

  mapTableData() {
    let dataArr = [];
    this.vaccineDataSource.forEach((value: any) => {
      dataArr.push({
        batch_no: {name: value.batch_no, status: value.status},
        material_name: value.material_name,
        no_of_doses_in_batch: value.no_of_doses_in_batch,
        no_of_vials: value.no_of_vials,
        doses_consumed: value.doses_consumed,
        material_no_of_doses_per_vial: value.material_no_of_doses_per_vial,
        expected_availability_date: moment(value.expected_availability_date).format("MM-DD-yyyy"),
        expiry_date: moment(value.expiry_date).format("MM-DD-yyyy"),
        id: value.id,
        cSelected: value.material_color
      });

      // batch_no: "PQR007"
      // create_time: "2021-03-13T10:45:02.340Z"
      // expected_availability_date: "2021-03-12T18:30:00.000Z"
      // expiry_date: "2021-03-30T18:30:00.000Z"
      // id: "7b34b6ba-ef38-43df-ae45-573ecc279dd2"
      // is_active: true
      // material_description: "Robust 3rd generation database"
      // material_gaps_in_days_between_doses: 21
      // material_name: "Pfizer"
      // material_no_of_doses_in_series: 3
      // material_no_of_doses_per_vial: 5
      // material_type: "Vaccine"
      // modify_time: "2021-03-13T10:45:02.340Z"
      // no_of_doses_in_batch: 5
      // no_of_vials: 20
      // recceived_date: "2021-01-21"
      // site_id: "44a61197-07a0-40a8-b618-ab6c3519ee98"
      // status: "Empty"
      //   id: value.id,
      //   seat: value.seat_name,
      //   vaccinator: value.$expanded.vaccinator_names,
      //   vaccine: value.$expanded.vaccine_name,
      //   allocation: 'Public',
      //   status: value.status
    });

    this.dataSource = new MatTableDataSource<PeriodicElement>(dataArr);
    this.dataSource.sort = this.sort;
  }

  getPageVaccine($event) {
    this.pageSize = $event.pageSize
    this.loadVaccineList($event.pageIndex + 1, this.pageSize, this.searchText);
  }

  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.loadVaccineList(1, this.pageSize, this.searchText);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkIFBlankLoadData(searchText) {
    if (searchText.value.trim() == '') {
      this.searchText = ''
      this.loadVaccineList(1, this.pageSize, this.searchText);
    }
  }

  deleteVaccineMaterial(vaccineId) {
    let reqData = {
      id: vaccineId,
    };
    this._spinner.showLoader();
    this._siteAdminService.deleteMaterial(reqData).subscribe(
      (res) => {
        this._spinner.hideLoader();
        //console.log(res);
        this.loadVaccineList(1, this.pageSize, this.searchText);
      },
      (err) => {
        this._spinner.hideLoader();
        //console.log(err);
      }
    );
  }
}
