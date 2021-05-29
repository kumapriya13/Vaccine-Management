import { AuthManageService } from './../../../core/services/auth/auth-manage.service';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../core';
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
  selector: 'app-receptionist-list',
  templateUrl: './receptionist-list.component.html',
  styleUrls: ['./receptionist-list.component.scss']
})
export class ReceptionistListComponent implements OnInit {
  site_ids: any[];
  receptionistInfo: any;

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
    private _location: Location,
    private authManageService: AuthManageService,
    private _spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.site_ids = this.authManageService.getLoggedInUser()['site_ids'];
    this.loadReceptionistList(this.pageIndex + 1, this.pageSize, this.searchText);
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

    // {
    //   "user_id": "sunil1_rahway_receptionist",
    //   "user_name": "sunil1_rahway_receptionist",
    //   "user_type": "receptionist",
    //   "lname": "saptal",
    //   "fname": "sunil",
    //   "email": "sunil192013@yopmail.com",
    //   "mobile_number": "+918097131359",
    //   "dob": "1941-11-09",
    //   "gender": "Male",
    //   "address1": "1 Test Drive",
    //   "address2": "",
    //   "address3": "",
    //   "state": "NJ",
    //   "zip": "07040",
    //   "county": "Bergen",
    //   "country": "United States",
    //   "site_ids": [
    //     "44a61197-07a0-40a8-b618-ab6c3519ee98"
    //   ],
    //   "id": "fc174663-d23d-47be-bd77-331718acb9cc",
    //   "is_active": true,
    //   "create_time": "2021-03-19T08:15:05.782Z",
    //   "modify_time": "2021-03-19T08:15:05.782Z",
    //   "$expanded": {
    //     "sites": [
    //       {
    //         "site_id": "44a61197-07a0-40a8-b618-ab6c3519ee98",
    //         "site_name": "RWJ Rahway Clinic"
    //       }
    //     ]
    //   }
    // }
  }

  getPageReceptionist($event) {
    this.pageSize=$event.pageSize
    this.loadReceptionistList($event.pageIndex + 1, this.pageSize, this.searchText);
  }

  navToEditReceptionistPage(receptionistItem: any) {
    this._router.navigate(['/site-admin/receptionist-update', receptionistItem.id]);
  }

  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.loadReceptionistList(1, this.pageSize, this.searchText);
  }

  searchByFilterText(searchInput) {
    this.loadReceptionistList(1, this.pageSize, searchInput);
  }

 

  onDeleteReceptionist(receptionist) {
    this._spinner.showLoader();
    // this._siteAdminService.deleteReceptionist(receptionist.id).subscribe((res) => {
      this._spinner.hideLoader();
    //   this.notify.showNotification('Receptionist deleted successfully');
    //   this.loadReceptionistList(this.pageIndex, this.pageSize, this.searchText);
    // },
    //   (err) => this.notify.showNotification('Something went wrong', 'bottom', 'error'));
  }
  OnStatus(user){
    this._spinner.showLoader();
    this._siteAdminService.getUserStatus(user).subscribe((res) => {
      this._spinner.hideLoader();
      this.loadReceptionistList(this.pageIndex + 1, this.pageSize, this.searchText);
  });
  }
  loadReceptionistList(pageIndex: number, pageSize: number, searchText: string) {
    this._spinner.showLoader();
    this._siteAdminService.getReceptionistDataUser(pageIndex, pageSize, searchText).subscribe(
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
