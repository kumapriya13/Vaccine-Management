import { Component, OnInit } from '@angular/core';
import { BulkUpload } from '../../../core/services/bulkupload.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/services/spinner.service';
@Component({
  selector: 'app-vaccine-list',
  templateUrl: './vaccine-list.component.html',
  styleUrls: ['./vaccine-list.component.scss'],
})
export class VaccineListComponent implements OnInit {
  vaccineDataList: any[] = [];
  totalCount: number = 0;
  pageIndex: number = 1;
  pageLength: number = 20;
  fileToUpload: File = null;
  vaccineUploadResponse: any[] = [];
  successCount: number = 0;
  failureCount: number = 0;
  successStatus: boolean = null;
  failureStatus: boolean = false;
  vaccineInfo: any;
  searchValue: any;
  vaccineObjPayload: object = {
    pageIndex: this.pageIndex,
    pageLength: this.pageLength,
  };
  constructor(
    private bulkUpload: BulkUpload,
    private _router: Router,
    private _spinner: SpinnerService
    
    ) {}

  ngOnInit() {
    this.getVaccineDataUser(this.vaccineObjPayload);

    // //console.log('this.failureStatus,', this.failureStatus)
  }

  getVaccineDataUser(vaccineObjPayload) {
    this._spinner.showLoader();
    this.bulkUpload.getVaccineDataUser(vaccineObjPayload).subscribe((res) => {
      this._spinner.hideLoader();
      console.log(res);
      this.totalCount = res.resultMetadata.count;
      this.pageIndex = res.resultMetadata.page;
      this.vaccineDataList = res.results;
    });
  }
  getPageVaccineDataUser(pageindex, pageLength) {
    this.vaccineObjPayload = {
      pageIndex: pageindex,
      pageLength: pageLength,
    };
    this.getVaccineDataUser(this.vaccineObjPayload);
  }

 onPageChange(pageIndex) {
    this.pageIndex = pageIndex;
    let reqObj = {
      pageIndex: pageIndex,
      pageLength: this.pageLength,
    };
    this._spinner.showLoader();
    this.getVaccineDataUser(reqObj);
  }

  searchVaccine() {
    this.vaccineObjPayload['searchdata'] = this.searchValue;
    //console.log(this.searchValue)
    this.getVaccineDataUser(this.vaccineObjPayload);
  }
  gotFileFromLocal(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  vaccineEdit(data: any) {
    this._router.navigateByUrl('/super-admin/recipient-edit', {
      state: {
        action: `edit`,
        data: data,
      },
    });
  }
  uploadCSVFile() {
    this.bulkUpload.getData(this.fileToUpload).subscribe(
      (res: any) => {
        this.vaccineUploadResponse = res;
        this.failureStatus = res.failed.length > 0 ? true : false;
        this.successStatus = res.registered.length > 0 ? true : false;
        this.resetForm();
      },
      (err) => {
        //console.log('Error Response : ', err);
      }
    );
  }

  resetForm() {
    //console.log('reset here')
    // this.userFile.nativeElement.value = null;
  }

  downloadMyFile(type) {
    let data: any = this.vaccineUploadResponse;
    if (data.failed.length > 0 || data.registered.length > 0) {
      let result: any[] = 'success' == type ? data.registered : data.failed;
      if (result.length > 0) {
        let content = this.ConvertToCSV(result, Object.keys(result[0]));
        this.downloadFile(content, 'vaccine_' + type);
      }
    }
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + array[i][head];
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
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
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

  downloadvaccineTemplate() {
    this.bulkUpload.recipientsTemplate().subscribe(
      (res: any) => {
        //console.log('Res : ', res);
        let content = this.ConvertToCSV(res, Object.keys(res[0]));
        this.downloadFile(content, 'vaccine_template');
      },
      (err) => {
        //console.log('Error Response : ', err);
      }
    );
  }
  onDeleteSeat(item: string) {
    //console.log(item)
    this.bulkUpload.deleteVaccineDataUser(item).subscribe((res) => {
      this.getVaccineDataUser(this.vaccineObjPayload);
    });
  }
}
