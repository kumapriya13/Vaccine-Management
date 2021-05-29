import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NotificationJobService } from '../../../../../core';

@Component({
  selector: 'notification-content',
  templateUrl: './notification-content.component.html',
  styleUrls: ['./notification-content.component.scss'],
})
export class NotificationContentComponent implements OnInit {
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();

  @Input() notification: any;

  page = 1;
  pageLength = 10;
  totalCount: number;

  recipients: any[];

  constructor(private notificationJobService: NotificationJobService) {}

  ngOnInit(): void {
    this.loadRecipients();
  }

  loadRecipients(): void {
    this.notificationJobService
      .getNotificationJob(this.notification.id, this.page, this.pageLength)
      .subscribe((res) => {
        this.totalCount = res.$expanded.resultMetadata.count;
        this.recipients = res.$expanded.results;
      });
  }

  onDelete(): void {
    this.remove.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onPageChange(pageIndex): void {
    this.page = pageIndex;
    this.loadRecipients();
  }
}
