import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationAlertComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  onYes(): void {
    this.dialogRef.close({ state: true });
  }
  onNo(): void {
    this.dialogRef.close({ state: false });
  }

}
