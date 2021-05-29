import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SuperAdminService } from '../../../core';

@Component({
  selector: 'app-page-sites',
  templateUrl: './page-sites.component.html',
  styleUrls: ['./page-sites.component.scss'],
})
export class PageSitesComponent implements OnInit {
  pageIndex = 1;
  pageLength = 10;
  sitelists: any;
  totalCount: any;
  sitelistinfo: [];

  constructor(
    private _superAdminService: SuperAdminService,
    private notify: NotificationService,
    private modalService: NgbModal,
    private _spinner: SpinnerService
  ) {}


  searchValue: any;
  
  payload: object = {
    pageIndex: this.pageIndex,
    pageLength: this.pageLength,
  };

  ngOnInit(): void {
    this.onPageChange(this.pageIndex);
  }

  onPageChange(pageIndex) {
    this.pageIndex = pageIndex;
    let reqObj = {
      page: pageIndex,
      pageLength: this.pageLength,
    };
    this._spinner.showLoader();
    this._superAdminService.getSite(reqObj).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.sitelists = res.results;
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  onDelete(content, object) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this._superAdminService.deleteSite(object.id).subscribe(
          (res) => {
            this.notify.showNotification('Site deleted successfully');
            this.onPageChange(this.pageIndex);
          },
          (err) => this.notify.showNotification('Something went wrong', 'bottom', 'error'),
        );
      },
      (reason) => {
        console.log(reason);
      },
    );
  }

  searchSites(searchValue) {    
    this.payload['q'] = searchValue;
    this._superAdminService.getSite(this.payload).subscribe(
      (res) => {
        this.sitelists = res.results;
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page;
      },
      (err) => {
        console.log(err);
      },
    );
  }
}
