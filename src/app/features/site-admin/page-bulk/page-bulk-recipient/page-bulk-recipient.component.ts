import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../../core';


@Component({
  selector: 'app-page-bulk-recipient',
  templateUrl: './page-bulk-recipient.component.html',
  styleUrls: ['./page-bulk-recipient.component.scss'],
})
export class PageBulkRecipientComponent implements OnInit {
  bulkUploadRecipientForm: FormGroup;
  fileToUpload: File = null;
  isFileSelected: boolean = false;
  uploadInProgress: boolean = false;
  uploadResult: any = null;


  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _siteAdminService: SiteAdminService,
    private notify: NotificationService
  ) { }
  ngOnInit(): void {

  }



  onFileChange(event) {
    this.fileToUpload = event.target.files[0];
    this.isFileSelected = true;
  }

  onUpload() {
    this.uploadInProgress = true;
    this.bulkUploadRecipientFormSub();
  }

  refreshPage() {
    window.location.reload();
  }



  bulkUploadRecipientFormSub() {
    this._siteAdminService.bulkUploadRecipients(this.fileToUpload).subscribe(
      (res) => {
        this.uploadResult = res;
        this.fileToUpload= null;
        this.isFileSelected = false;
        this.uploadInProgress = false;
      },
      (err) => {
        alert('error: ' + JSON.stringify(err));
        this.fileToUpload = null;
        this.isFileSelected = false;
        this.uploadInProgress = false;
      }
    );
  }
}
