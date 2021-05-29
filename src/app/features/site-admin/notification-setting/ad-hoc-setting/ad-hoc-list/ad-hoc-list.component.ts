import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationJobService } from '../../../../../core';

@Component({
  selector: 'app-ad-hoc-list',
  templateUrl: './ad-hoc-list.component.html',
  styleUrls: ['./ad-hoc-list.component.scss'],
})
export class AdHocListComponent implements OnInit {
  pendingNotifications: any[];
  sentNotifications: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private notificationJobService: NotificationJobService,
  ) {}

  ngOnInit(): void {
    this.loadJobs('pending');
    this.loadJobs('complete');
  }

  onAddNotification(): void {
    this.router.navigate(['./new'], { relativeTo: this.route });
  }

  onDelete(content, notificationId: string, status: string, accordion: NgbAccordion): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        accordion.collapseAll();
        this.notificationJobService.deleteNotificationJob(notificationId).subscribe(() => {
          this.loadJobs(status);
        });
      },
      (reason) => {
        console.log(reason);
      },
    );
  }

  onEdit(notificationId: string): void {
    this.router.navigate(['./resend', notificationId], { relativeTo: this.route });
  }

  private loadJobs(status: string): void {
    this.notificationJobService.getNotificationList(status as any).subscribe(({ results }) => {
      if (status === 'complete') {
        this.sentNotifications = results;
      } else if (status === 'pending') {
        this.pendingNotifications = results;
      }
    });
  }
}
