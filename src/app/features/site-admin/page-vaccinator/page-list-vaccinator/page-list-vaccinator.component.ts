import { AuthManageService } from 'src/app/core';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../../core';
import { SpinnerService } from 'src/app/core/services/spinner.service';

export interface PeriodicElement {
  user_name: string,
  name: string,
  email: string,
  mobile_number: string,
  id: string
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-page-list-vaccinator',
  templateUrl: './page-list-vaccinator.component.html',
  styleUrls: ['./page-list-vaccinator.component.scss'],
})
export class PageListVaccinatorComponent implements OnInit {
  site_ids: any[];
  vaccinatorInfo: any;

  displayedColumns: string[] = [
    "user_name",
    "name",
    "email",
    "mobile_number",
    "id"
  ];



  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  seatsDataSource: any[] = [];
  seatData: any;
  searchText: string = '';

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private _router: Router,
    private authManageService: AuthManageService,
    private _location: Location,
    private _spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.site_ids = this.authManageService.getLoggedInUser()['site_ids'];
    this.loadVaccinatorList(this.pageIndex + 1, this.pageSize, this.searchText);
  }

  backClicked() {
    this._location.back();
  }

  mapTableData() {
    let dataArr = [];
    this.seatsDataSource.forEach((value: any) => {
      dataArr.push({
        "user_name": value.user_name,
        "name": value.fname + " " + value.lname,
        "email": value.email,
        "mobile_number": value.mobile_number,
        "id": value.id,
        "is_disabled":value.is_disabled ? true : false
      });
    });

    this.dataSource = new MatTableDataSource<PeriodicElement>(dataArr);
    this.dataSource.sort = this.sort;
  }

  getPageVaccinator($event) {
    this.pageSize = $event.pageSize
    this.loadVaccinatorList($event.pageIndex + 1, this.pageSize, this.searchText);
  }

  navToEditVaccinatorPage(vaccinatorItem: any) {
    this._router.navigate(['/site-admin/edit-vaccinator', vaccinatorItem.id]);
  }

  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.loadVaccinatorList(1, this.pageSize, this.searchText);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkIFBlankLoadData(searchText) {
    if (searchText.value.trim() == '') {
      this.searchText = ''
      this.loadVaccinatorList(1, this.pageSize, this.searchText);
    }
  }

  downloadFile() {
    let header = ['fname', 'lname', 'email', 'mobile_number', 'user_name', 'user_type'];
    this._spinner.showLoader();
    this._siteAdminService.getVaccinatorList(1, this.totalCount, this.searchText).subscribe(
      (res) => {
        this._spinner.hideLoader();
        let result = res.results;
        this._siteAdminService.downloadFile(result, `Vaccinator`, header);
      },
      (err) =>
        this.notify.showNotification('something went wrong', 'bottom', 'error')
    );
  }

  OnStatus(user){
    this._spinner.showLoader();
      this._siteAdminService.getUserStatus(user).subscribe((res) => {
        this._spinner.hideLoader();
        this.loadVaccinatorList(this.pageIndex + 1, this.pageSize, this.searchText);

    });
    }
  onDeleteVaccinator(vaccinator) {
    this._spinner.showLoader();
    this._siteAdminService.deleteVaccinator(vaccinator.id).subscribe((res) => {
      this._spinner.hideLoader();
      this.notify.showNotification('Vaccinator deleted successfully');
      this.loadVaccinatorList(this.pageIndex, this.pageSize, this.searchText);
    },
      (err) => this.notify.showNotification('Something went wrong', 'bottom', 'error'));
  }

  loadVaccinatorList(pageIndex: number, pageSize: number, searchText: string) {
    this._spinner.showLoader();
    this._siteAdminService.getVaccinatorList(pageIndex, pageSize, searchText).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.seatsDataSource = res.results;
        this.mapTableData();
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page - 1;
      },
      (err) => {
        this.notify.showNotification('something went wrong', 'bottom', 'error')
      }
    );
  }
}
