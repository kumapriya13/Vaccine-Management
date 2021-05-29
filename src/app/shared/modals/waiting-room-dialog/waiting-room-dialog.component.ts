import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BackOffService } from 'src/app/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'waiting-room-dialog',
  templateUrl: './waiting-room-dialog.component.html',
  styleUrls: ['./waiting-room-dialog.component.scss'],
})
export class WaitingRoomDialogComponent implements OnInit {
  @ViewChild('content') modalContent: TemplateRef<any>;

  modalRef: NgbModalRef;

  nextRetryInterval: number;

  intervalSubscription: Subscription;

  constructor(private backoffService: BackOffService, private modalService: NgbModal) {
    this.backoffService.backoffStatus$
      .pipe(untilDestroyed(this))
      .subscribe(({ status, nextRetryInterval }) => this.handleBackoffStatus(status, nextRetryInterval));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
  }

  handleBackoffStatus(status: string, nextRetryInterval: number): void {
    if (status === 'retrying') {
      this.nextRetryInterval = Math.round(nextRetryInterval / 1000);

      this.intervalSubscription?.unsubscribe();
      this.intervalSubscription = interval(1000)
        .pipe(filter(() => this.nextRetryInterval > 0))
        .subscribe(() => this.nextRetryInterval--);

      if (!this.modalRef) {
        this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' });

        this.modalRef.result
          .catch(() => {
            this.backoffService.cancelBackoffProcess();
          })
          .finally(() => {
            this.intervalSubscription.unsubscribe();
            this.modalRef = null;
          });
      }
    } else {
      this.modalRef?.close();
    }
  }
}
