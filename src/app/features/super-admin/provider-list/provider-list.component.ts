import { Component, OnInit } from '@angular/core';
import { BulkUpload } from '../../../core/services/bulkupload.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { SpinnerService } from 'src/app/core/services/spinner.service';
@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  providerDataList: any[] = [];
  totalCount = 0;
  pageIndex = 1;
  pageLength = 20;
  fileToUpload: File = null;
  recipietUploadResponse: any[] = [];
  successCount = 0;
  failureCount = 0;
  successStatus: boolean = null;
  failureStatus = false;
  recipientInfo: any;
  searchValue: any;
  recipientObjPayload: any = {
    pageIndex: this.pageIndex,
    pageLength: this.pageLength,
  };
  constructor(
    private bulkUpload: BulkUpload, 
    private router: Router,
    private _spinner: SpinnerService
    ) {}
  ngOnInit(): void {
    this.getProviderDataUser(this.recipientObjPayload);
    // console.log('this.failureStatus,', this.failureStatus)
  }
  getProviderDataUser(recipientObjPayload): void {
    this._spinner.showLoader();
    this.bulkUpload
      .getProviderDataUser(recipientObjPayload)
      .subscribe((res) => {
        this._spinner.hideLoader();
        console.log(res);
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page;
        this.providerDataList = res.results;
      });
  }
  getPageRecipientDataUser(pageindex, pageLength) {
    this.recipientObjPayload = {
      pageIndex: pageindex,
      pageLength,
    };
    this.getProviderDataUser(this.recipientObjPayload);
  }

  onPageChange(pageIndex) {
    this.pageIndex = pageIndex;
    let reqObj = {
      pageIndex: pageIndex,
      pageLength: this.pageLength,
    };
    this._spinner.showLoader();
    this.getProviderDataUser(reqObj);
  }

  searchRecipient(searchValue): void {
    this.recipientObjPayload.searchdata = searchValue;
    this.bulkUpload
      .getProviderDataUser(this.recipientObjPayload)
      .subscribe((res) => {
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page;
        this.providerDataList = res.results;
      });
  }
  gotFileFromLocal(file: FileList): void {
    this.fileToUpload = file.item(0);
  }
  uploadCSVFile(): void {
    this.bulkUpload.getData(this.fileToUpload).subscribe(
      (res: any) => {
        this.recipietUploadResponse = res;
        this.failureStatus = res.failed.length > 0 ? true : false;
        this.successStatus = res.registered.length > 0 ? true : false;
        this.resetForm();
      },
      (err) => {
        console.log('Error Response : ', err);
      }
    );
  }
  resetForm(): void {
    console.log('reset here');
    // this.userFile.nativeElement.value = null;
  }
  downloadMyFile(type): void {
    const data: any = this.recipietUploadResponse;
    if (data.failed.length > 0 || data.registered.length > 0) {
      const result: any[] = 'success' === type ? data.registered : data.failed;
      if (result.length > 0) {
        const content = this.ConvertToCSV(result, Object.keys(result[0]));
        this.downloadFile(content, 'recipient_' + type);
      }
    }
  }
  ConvertToCSV(objArray, headerList): any {
    const array =
      typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    // tslint:disable-next-line: forin
    for (const index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      // tslint:disable-next-line: forin
      for (const index in headerList) {
        const head = headerList[index];
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadFile(csvData, filename): void {
    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser =
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {
      // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  downloadRecipientTemplate(): void {
    this.bulkUpload.recipientsTemplate().subscribe(
      (res: any) => {
        console.log('Res : ', res);
        const content = this.ConvertToCSV(res, Object.keys(res[0]));
        this.downloadFile(content, 'recipient_template');
      },
      (err) => {
        console.log('Error Response : ', err);
      }
    );
  }

  onDeleteSeat(item: string): void {
    this.bulkUpload.deleteProviderDataUser(item).subscribe((res) => {
      this.getProviderDataUser(this.recipientObjPayload);
    });
  }
}
