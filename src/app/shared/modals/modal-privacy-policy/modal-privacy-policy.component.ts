import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-privacy-policy',
  templateUrl: './modal-privacy-policy.component.html',
  styleUrls: ['./modal-privacy-policy.component.scss']
})
export class ModalPrivacyPolicyComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalPrivacyPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _location: Location
  ) { }

  ngOnInit(): void { }

  onNoClick(): void { this.dialogRef.close(); }
}
