import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QuillEditorComponent } from 'ngx-quill';
import { NotificationJobService } from 'src/app/core';

import { ReceptionistService } from '../../../../core/services/receptionist.service';
import { RecipientListInputComponent } from '../recipient-filter/recipient-list-input.component';

@Component({
  selector: 'manage-private-slots',
  templateUrl: './manage-private-slots.component.html',
  styleUrls: ['./manage-private-slots.component.scss'],
})
export class ManagePrivateSlotsComponent implements OnInit {
  @ViewChild(RecipientListInputComponent) recipientListInput: RecipientListInputComponent;
  @ViewChild(QuillEditorComponent) templateEditor: QuillEditorComponent;

  checked: boolean = true;
  notificationEditorVisible: boolean;

  notificationTitle: string;
  notificationMessage: string;

  fields = ['firstName', 'lastName', 'address', 'visitInfo', 'dose1', 'dose2', 'classificationCode', 'qrCode'];

  recipientQuery: string;

  constructor(
    public dialogRef: MatDialogRef<ManagePrivateSlotsComponent>,
    private receptionistService: ReceptionistService,
    private notificationService: NotificationJobService,
  ) {}

  ngOnInit(): void {}

  save(): void {
    this.recipientQuery = this.recipientListInput.buildRecipientQuery();
    this.receptionistService.patchRecipients(this.recipientQuery, this.checked).subscribe(() => {
      this.notificationEditorVisible = true;
    });
  }

  send(): void {
    this.notificationService
      .createNotification(
        new Date().toISOString(),
        this.notificationTitle,
        this.notificationMessage,
        this.recipientQuery,
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  recipientFieldSelected(field: string): void {
    const quillEditor = this.templateEditor.quillEditor;
    const selection = quillEditor.getSelection(true);
    quillEditor.insertText(selection.index, `{{${field}}}`);
    setTimeout(() => {
      quillEditor.focus();
    });
  }

  isNotificationValid(): boolean {
    return this.notificationTitle?.trim() && !!this.notificationMessage;
  }
}
