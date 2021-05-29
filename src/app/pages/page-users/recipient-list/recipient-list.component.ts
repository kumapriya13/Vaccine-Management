import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { BulkUpload } from 'src/app/core';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recipient-list',
  templateUrl: './recipient-list.component.html',
  styleUrls: ['./recipient-list.component.scss'],
})
export class RecipientListComponent implements OnInit {
  RecipientDataList: any[] = [];
  totalCount: number = 0;
  pageIndex: number = 1;
  pageLength: number = 10;
  fileToUpload: File = null;
  recipietUploadResponse: any[] = [];
  successStatus: boolean = null;
  failureStatus: boolean = false;
  searchValue: any;
  failureMessage: string = null;
  public files: any[] = [];

  uploading: boolean;

  searchText:string='';

  recipientObjPayload: object = {
    pageIndex: this.pageIndex,
    pageLength: this.pageLength,
  };

  @ViewChild('userFile', {
    static: false,
  })
  adminDataList: any;

  constructor(
    private bulkUpload: BulkUpload,
    private _router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private _spinner: SpinnerService
  ) {}

  ngOnInit() {
    this.getRecipientDataUser(this.recipientObjPayload);
  }

  getRecipientDataUser(recipientObjPayload) {
    this._spinner.showLoader();
    this.bulkUpload.getRecipientDataUser(recipientObjPayload).subscribe((res) => {
      this._spinner.hideLoader();
      this.totalCount = res.resultMetadata.count;
      this.pageIndex = res.resultMetadata.page;
      this.RecipientDataList = res.results;
    });
  }

  onPageChange(pageIndex) {
     this.pageIndex = pageIndex;
    this.recipientObjPayload = {
      pageIndex: this.pageIndex,
      pageLength: this.pageLength,
      searchdata: this.searchText
    };
    this.getRecipientDataUser(this.recipientObjPayload);
  }

  searchRecipient(searchValue) {
   this.searchText=searchValue;
   let recipientObjPayloadObj = {
      pageIndex: 1,
      pageLength: 10,
      searchdata: searchValue
    };
    this.bulkUpload.getRecipientDataUser(recipientObjPayloadObj).subscribe((res) => {
      this.totalCount = res.resultMetadata.count;
      this.pageIndex = res.resultMetadata.page;
      this.RecipientDataList = res.results;
    });
  }

  gotFileFromLocal(file: FileList) {
    this.fileToUpload = file.item(0);
    this.files = Object.keys(file).map(key => file[key]);
    this.failureMessage = '';
    this.failureStatus = null;
    this.successStatus = null;
  }

  recipientEdit(data: any) {
    this._router.navigate(['../recipient/edit', data.id], {
      relativeTo: this.route,
    });
  }

  uploadCSVFile() {
    this.failureMessage = '';
    if (null != this.fileToUpload) {
      this.failureMessage= null;
      this.uploading = true;
      this.bulkUpload
        .getData(this.fileToUpload)
        .pipe(tap(() => (this.uploading = false)))
        .subscribe(
          (res: any) => {
            this.recipietUploadResponse = res;
            this.failureStatus = res.failed.length > 0 ? true : false;
            this.successStatus = res.registered.length > 0 ? true : false;
            this.resetUploadForm();
            this.getRecipientDataUser(this.recipientObjPayload);

          },
          (err) => {
            this.uploading= false
            let errors = err.error;

            this.failureMessage = undefined != errors && Object.keys(errors).length > 0 ? errors.message : '';
          },
        );
    } else {
      this.failureMessage = 'File is required';
      this.successStatus=null
      this.failureStatus=null
    }
  }

  resetUploadForm() {
    this.fileToUpload = null;
    this.files=[]

  }

  downloadMyFile(type) {

    let data: any = this.recipietUploadResponse;
    if (data.failed.length > 0 || data.registered.length > 0) {
      let result: any[] = 'success' == type ? data.registered : data.failed;
      if (result.length > 0) {
        let content = this.ConvertToCSV(result, Object.keys(result[0]));
        this.downloadFile(content, 'recipient_' + type);
      }
    }
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];
        if(head == 'zipcode')   {
          if( array[i][head].length >= 5){
            line += array[i][head]+ ',';
          }else if(array[i][head].length <= 4){
            line += array[i][head].charAt(0) != '0' ? '=CHAR(048)&' + array[i][head] + ',' : array[i][head]+ ',';
          }else{
            line += array[i][head] + ',';
          }
        }    else {
          line += array[i][head] + ',';
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadFile(csvData, filename) {
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  downloadRecipientTemplate() {
    this.bulkUpload.recipientsTemplate().subscribe(
      (res: any) => {
        this.downloadTemplateFile(res);
      },
      (err) => {
        console.log('Error Response : ', err);
      }
    );
  }

  downloadTemplateFile(data: any) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row) => {
      return header
        .map((fieldName) => {
          let cell =
            undefined == row[fieldName] || '' == row[fieldName]
              ? ''
              : row[fieldName];
          let headerNames = ['Date of Birth', 'ZipCode'];
          if (-1 != headerNames.indexOf(fieldName)) {
             cell = 'ZipCode' == fieldName ? '=CHAR(048)&' + cell : ' ' + cell;
            // cell = 'ZipCode' == fieldName ?   cell : cell;

          } else {
            cell = cell.toString().replace(/"/g, '""');
          }
          return JSON.stringify(cell, replacer);
        })
        .join(',');
    });
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/plain' });
    saveAs(blob, 'recipient.csv');
  }

  openUploadDialog(content): void {
    this.failureMessage = "";
    this.failureStatus = null;
    this.successStatus = null;
    this.fileToUpload =null;
    this.files =[]
        this.modalService.open(content, { size: 'lg', windowClass: 'upload-dialog' });
  }

  onDelete(content, user: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        // console.log(user);
        this.bulkUpload.deleteRecipientDataUser(user.mobile_number).subscribe((res) => {
          console.log(res);
        });
      },
      (reason) => {
        console.log(reason);
      },
    );
  }
}
