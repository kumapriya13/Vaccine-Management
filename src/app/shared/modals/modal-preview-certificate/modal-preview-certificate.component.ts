import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipientService } from 'src/app/core';



@Component({
  selector: 'app-modal-preview-certificate',
  templateUrl: './modal-preview-certificate.component.html',
  styleUrls: ['./modal-preview-certificate.component.scss']
})
export class ModalPreviewCertificateComponent implements OnInit {

  responseFlag:boolean = false;
  profileImage:string='';

  constructor(
    public dialogRef: MatDialogRef<ModalPreviewCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _location: Location,
    private recipientService:RecipientService
  ) {}
  backClicked() {
    this._location.back();
  }
  ngOnInit(): void {
     this.getCertificatePreview();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getCertificatePreview(){
    this.recipientService.getCertificatePreview(this.data?.recipient_id).subscribe(res => {
      this.profileImage = res.image;
      // debugger;
      this.responseFlag = true;
      console.log(res);
    }, err => {
      this.responseFlag = true;
      console.log(err);
    });
  }
}

