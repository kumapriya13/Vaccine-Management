import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-terms-of-use',
  templateUrl: './modal-terms-of-use.component.html',
  styleUrls: ['./modal-terms-of-use.component.scss'],
})
export class ModalTermsOfUseComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalTermsOfUseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _location: Location
  ) {}
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

