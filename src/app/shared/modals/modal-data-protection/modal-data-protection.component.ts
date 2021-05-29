import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-data-protection',
  templateUrl: './modal-data-protection.component.html',
  styleUrls: ['./modal-data-protection.component.scss'],
})
export class ModalDataProtectionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalDataProtectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _location: Location
  ) { }

  ngOnInit(): void { }

  onNoClick(): void { this.dialogRef.close(); }
}
