import { AuthManageService } from './../../../core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SuperAdminService } from 'src/app/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'app-provider-site',
  templateUrl: './provider-site.component.html',
  styleUrls: ['./provider-site.component.scss'],
})
export class ProviderSiteComponent implements OnInit, OnDestroy {
  private awake$ = new Subject<void>();
  pageIndex = 1;
  pageLength = 10;
  totalCount: any;
  sitelists: any[] = [];

  constructor(
    private notify: NotificationService,
    private superAdminService: SuperAdminService,
    private modalService: NgbModal,
    private authManageService: AuthManageService,
    private router: Router,
    private _spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.onPageChange(this.pageIndex);
  }

  onPageChange = (pageIndex: number): void => {
    this.pageIndex = pageIndex;
    const reqObj = {
      page: pageIndex,
      pageLength: this.pageLength,
    };
    this._spinner.showLoader();
    this.superAdminService
      .getSite(reqObj)
      .pipe(takeUntil(this.awake$))
      .subscribe(
        (res) => {
          this._spinner.hideLoader();
          this.sitelists = res.results;
          this.totalCount = res.resultMetadata.count;
          this.pageIndex = res.resultMetadata.page;
        },
        (err) => {
          this._spinner.hideLoader();
          console.log(err);
        }
      );
  }

  onDelete = (content: any, object: { id: string; }): void => {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.superAdminService
            .deleteSite(object.id)
            .pipe(takeUntil(this.awake$))
            .subscribe(
              (res) => {
                this.notify.showNotification('Site deleted successfully');
                this.onPageChange(this.pageIndex);
              },
              (err) =>
                this.notify.showNotification(
                  'Something went wrong',
                  'bottom',
                  'error'
                )
            );
        },
        (reason) => {
          console.log(reason);
        }
      );
  }

  onManage = (site: any): void => {
    let loggedInUser = this.authManageService.getLoggedInUser();
    localStorage.setItem('selectedSiteId', site.id);
    loggedInUser = {
      ...loggedInUser,
      site_ids: [site.id],
      sites: [{
        site_name: site.site_name,
        site_id: site.id,
      }]
    };
    this.authManageService.setLoggedInUser(loggedInUser);
    this.router.navigateByUrl(`/site-admin/dashboard`);
  }

  ngOnDestroy(): void {
    this.awake$.next();
    this.awake$.complete();
  }
}
