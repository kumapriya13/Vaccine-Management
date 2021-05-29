import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipientAuthService } from '../../../core/services/auth/recipient-auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'recipient-invite-form',
  templateUrl: './recipient-invite-form.component.html',
  styleUrls: ['./recipient-invite-form.component.scss'],
})
export class RecipientInviteFormComponent implements OnInit {
  @Input() email: any;
  @Input() mobile_number: any;
  @Input() recipient: any;

  resendInvite: boolean;

  userType: 'email' | 'phone';
  selectedEmail: string;
  selectedMobileNumber: string;

  inviteFormVisible: boolean;
  isActivated: boolean;

  constructor(
    public modal: NgbActiveModal,
    private recipientAuthService: RecipientAuthService,
    private notificationService: NotificationService,
  ) {}

  get valid(): boolean {
    return this.resendInvite || !!(this.userType && this.selectedEmail && this.selectedMobileNumber);
  }

  ngOnInit(): void {
    this.isActivated = this.recipient.is_activated;
    this.resendInvite = this.recipient.inviteStatus === 'sent';
  }

  confirm(): void {
    const recipient = Object.assign({}, this.recipient);
    if (!this.resendInvite) {
      recipient.email = this.selectedEmail;
      recipient.mobile_number = this.selectedMobileNumber;
    }
    this.recipientAuthService.recipientInvite(recipient, this.userType).subscribe(() => {
      this.notificationService.showNotification('Invite has been sent successfully');
      this.close();
    });
  }

  close(): void {
    this.modal.close();
  }
}
