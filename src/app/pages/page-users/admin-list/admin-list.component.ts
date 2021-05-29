import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BulkUpload, AdminTypes, AdminAuthService } from 'src/app/core';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { adminTitleByType, adminRouteByType } from '../constants';
@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  totalCount: number = 0;
  pageIndex: number = 1;
  pageLength: number = 10;
  searchValue: any;
  searchText:string='';

  recipientObjPayload: object = {
    pageIndex: this.pageIndex,
    pageLength: this.pageLength,
  };
  adminDataList: any;

  adminTitleByType = adminTitleByType;

  currentAdminType: AdminTypes;

  constructor(
    private bulkUpload: BulkUpload,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private authUserService: AdminAuthService,
    private _spinner: SpinnerService
  ) {
    this.currentAdminType = this.authUserService.getAdminType();
  }

  ngOnInit() {
    this.getAdminDataUser(this.recipientObjPayload);
  }

  searchSiteAdmin(searchValue) {
    this.searchText = searchValue;
    let recipientObjPayload = {
      pageIndex:1,
      pageLength: 10,
      searchdata:searchValue
    };
    //this.recipientObjPayload['searchdata'] = searchValue;
    this._spinner.showLoader();
    this.bulkUpload.getAdminDataUser(recipientObjPayload).subscribe((res) => {
      this._spinner.hideLoader();
      this.totalCount = res.resultMetadata.count;
      this.pageIndex = res.resultMetadata.page;
      this.adminDataList = res.results;
    });
  }
  OnStatus(user){
    this._spinner.showLoader();
    this.bulkUpload.getUserStatus(user).subscribe((res) => {
      this._spinner.hideLoader();
      this.getAdminDataUser(this.recipientObjPayload);

    });
    }
  onPageChange(pageIndex) {
    this.pageIndex = pageIndex;
    this.recipientObjPayload = {
      pageIndex: this.pageIndex,
      pageLength: this.pageLength,
      searchdata:this.searchText
    };
    this.getAdminDataUser(this.recipientObjPayload);
  }

  getAdminDataUser(recipientObjPayload) {
    // manage/user/search
    this._spinner.showLoader();
    this.bulkUpload.getAdminDataUser(recipientObjPayload).subscribe((res) => {
      this._spinner.hideLoader();
      this.totalCount = res.resultMetadata.count;
      // console.log(res, this.totalCount, this.pageIndex);

      this.pageIndex = res.resultMetadata.page;
      this.adminDataList = res.results;
    });
  }

  onDelete(content, user: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(user);
      },
      (reason) => {
        console.log(reason);
      },
    );
  }

  onEdit(user): void {
    this.router.navigate(['../', adminRouteByType[user.user_type], 'update', user.id], { relativeTo: this.route });
  }
}
