import { AfterViewInit, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../core';
import { AuthManageService } from '../../../core/services/auth/auth-manage.service';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'page-recipient-appointment',
  templateUrl: './page-recipient-appointment.component.html',
  styleUrls: ['./page-recipient-appointment.component.scss'],
})
export class PageRecipientAppointmentComponent implements OnInit {
  recipientId: string;
  recipient: any;

  feature:string= 'site-admin'
  constructor(
    private _siteAdminService: SiteAdminService,
    private _router: Router,
    private notify: NotificationService,
    private activatedRoute: ActivatedRoute,
    private authManageService: AuthManageService,
    private datePipe: DatePipe,
    private _spinner: SpinnerService,
    private renderer: Renderer2,
  ) {
    this.recipientId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadRecipient();
  }

  ngOnInit(): void {}

  back(): void {
    this._router.navigate(['site-admin', 'appointment']);
  }

  bookAppointment(): void {
    this._router.navigate(['site-admin', 'book-appointment', this.recipientId]);
  }

  adverseEventReport(visitId): void {
    this._router.navigate(['site-admin', 'adverse-event', visitId]);
  }

  private loadRecipient(): void {
    this._siteAdminService.searchRecipients(`id=${this.recipientId}`, 1, 1).subscribe((result) => {
      this.recipient = result.results[0];
    })
  }
}
