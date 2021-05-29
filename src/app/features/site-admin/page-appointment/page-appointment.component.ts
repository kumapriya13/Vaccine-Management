import { DatePipe, Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModelBookSelectedAppointmentsComponent } from 'src/app/shared/modals/model-book-selected-appointments/model-book-selected-appointments.component';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../core';
import { BulkUpload } from 'src/app/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { BulkAppointmentComponent } from './bulk-appointment/bulk-appointment.component';
import { ManagePrivateSlotsComponent } from './manage-private-slots/manage-private-slots.component';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { AdminService } from '../../../core/services/admin.service';

export interface PeriodicElement {
  input_check_box: any;
  name: string;
  // dob:string;
  email: string;
  county: string;
  zip: string;
  id: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-page-appointment',
  templateUrl: './page-appointment.component.html',
  styleUrls: ['./page-appointment.component.scss'],
})
export class PageAppointmentComponent implements AfterViewInit {
  site_ids: any[];
  recpientInfo: any;
  appForm: FormGroup;
  successStatus: boolean = null;
  failureStatus: boolean = false;
  failureMessage: string = null;
  fileToUpload: File = null;
  uploading: boolean;
  public files: any[] = [];

  opt = [10, 25, 50, 100];
  @ViewChildren('children') children: QueryList<NgModel>;

  displayedColumns: string[] = ['input_check_box', 'name', 'dob', 'date', 'slottime', 'vaccine', 'dose', 'survey', 'status', 'id'];

  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  recipientDataSource: any[] = [];
  recipientDataDownload: any[] = [];
  searchText: string = '';
  checkAll: boolean = false;
  selectedList = [];

  recipientToInvite: any;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('searchInput') searchInput: ElementRef;

  private readonly APPOINTMENT_FILTER_KEY = 'site_admin-appoinment-search-filter';

  constructor(
    private adminService: AdminService,
    private _siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private _router: Router,
    private _location: Location,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private bulkUpload: BulkUpload,
    private _spinner: SpinnerService,
    private datepipe: DatePipe,
  ) {
    this.appForm = this.fb.group({
      checkArray: this.fb.array([]),
    });
  }

  ngAfterViewInit(): void {
    const storageValue = localStorage.getItem(this.APPOINTMENT_FILTER_KEY);
    const storedSearchText = storageValue == null ? '' : storageValue;
    this.searchText = storedSearchText;
    this.searchInput.nativeElement.value = storedSearchText;
    this.loadRecpientList(this.pageIndex + 1, this.pageSize, this.searchText);
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.APPOINTMENT_FILTER_KEY);
    if (this._router.url.indexOf('/site-admin/edit-recepient') != -1) {
      localStorage.setItem(this.APPOINTMENT_FILTER_KEY, this.searchText);
    }
  }

  backClicked() {
    this._location.back();
  }

  mapKeys(data = [], materials = [], isAdminCancel: any) {
    let obj = { status: 'new', vaccine: '', dose: '', slotTime: '', date: '', surveyId: '' }
    if (data.length == 0) {
      obj.status = 'new';
      obj.vaccine = '';
      obj.dose = '';
      obj.slotTime = '';
      obj.date = '';
      obj.surveyId = '';
    } else {

      if (materials.length > 0) {
        obj.vaccine = materials[materials.length - 1].hasOwnProperty('material_name') ? materials[materials.length - 1].material_name : '';
        obj.status = data[data.length - 1].RecipientFact.hasOwnProperty('status') ? data[data.length - 1].RecipientFact.status : '';
        obj.dose = data[data.length - 1].RecipientFact.hasOwnProperty('dose_in_series') ? data[data.length - 1].RecipientFact.dose_in_series : '';
        obj.slotTime = data[data.length - 1].RecipientFact.hasOwnProperty('dose_date') ? data[data.length - 1].RecipientFact.dose_date : '';
        obj.date = data[data.length - 1].RecipientFact.hasOwnProperty('dose_date') ? data[data.length - 1].RecipientFact.dose_date : '';
        obj.surveyId = data[data.length - 1].RecipientFact.hasOwnProperty('ticket_number') ? data[data.length - 1].RecipientFact.ticket_number : '';
      } else {
        // console.log("data", obj, isAdminCancel)
        obj.status = data[data.length - 1].hasOwnProperty('visit_status') ? data[data.length - 1].visit_status + ((isAdminCancel === '') ? '' : (isAdminCancel == true) ? ' (A)' : (isAdminCancel == false) ? ' (R)' : '') : '';
        obj.vaccine = data[data.length - 1].hasOwnProperty('material_name') ? data[data.length - 1].material_name : '';
        obj.dose = data[data.length - 1].hasOwnProperty('dose_in_series') ? data[data.length - 1].dose_in_series : '';
        obj.slotTime = data[data.length - 1].hasOwnProperty('start_time') ? data[data.length - 1].start_time : '';
        obj.date = data[data.length - 1].hasOwnProperty('start_time') ? data[data.length - 1].start_time : '';
        obj.surveyId = data[data.length - 1].hasOwnProperty('ticket_number') ? data[data.length - 1].ticket_number : '';
      }
    }
    return obj;
  }

  mapTableData() {
    let dataArr = [];
    let mapedData;
    this.recipientDataSource.forEach((value: any, index: number) => {
      if (value.hasOwnProperty('$expanded')) {
        let recipient_facts = (value.hasOwnProperty('recipient_facts') && Array.isArray(value.recipient_facts) && value.recipient_facts.length > 0) ? value.recipient_facts : false;
        let booked_visits = (value.$expanded.hasOwnProperty('booked_visits') && Array.isArray(value.$expanded.booked_visits) && value.$expanded.booked_visits.length > 0) ? value.$expanded.booked_visits : false;
        let cancelled_visits = (value.$expanded.hasOwnProperty('cancelled_visits') && Array.isArray(value.$expanded.cancelled_visits) && value.$expanded.cancelled_visits.length > 0) ? value.$expanded.cancelled_visits : false;
        let materials = (value.$expanded.hasOwnProperty('materials') && Array.isArray(value.$expanded.materials) && value.$expanded.materials.length > 0) ? value.$expanded.materials : false;
        let doseCountcheck = (materials && recipient_facts && recipient_facts[recipient_facts.length - 1].RecipientFact.dose_in_series == materials[materials.length - 1].material_no_of_doses_in_series) ? true : false;
        let isAdminCancel = (cancelled_visits && cancelled_visits[cancelled_visits.length - 1].hasOwnProperty('isAdminCancel')) ? cancelled_visits[cancelled_visits.length - 1].isAdminCancel : ''
        if (!booked_visits && !cancelled_visits) {
          if (!recipient_facts) {
            mapedData = this.mapKeys([], [], '')
          } else {
            mapedData = this.mapKeys(recipient_facts, materials, '');
          }
        }

        else if (!booked_visits && cancelled_visits) {
          if (recipient_facts && doseCountcheck) {
           // console.log("doseCountcheck", doseCountcheck, index)
            mapedData = this.mapKeys(recipient_facts, materials, '');
          } else {
            //console.log("doseCountcheck isAdminCancel", doseCountcheck, index, isAdminCancel, (isAdminCancel != '' ? (isAdminCancel == true ? ' (A)' : ' (R)') : ''))
            mapedData = this.mapKeys(cancelled_visits, [], isAdminCancel);
          }
        }
        else if (booked_visits && !cancelled_visits) {
          mapedData = this.mapKeys(booked_visits, [], '');
        }
        else if (booked_visits && cancelled_visits) {
          mapedData = this.mapKeys(booked_visits, [], '');
        }

      }

      dataArr.push({
        input_check_box: '',
        name: value.fname + ' ' + value.lname,
        dob: value.dob,
        email: value.email,
        mobile_number: value.mobile_number,
        county: value.country,
        zip: value.zip,
        id: value.id,
        dose: mapedData.dose,
        vaccine: mapedData.vaccine,
        surveyId: mapedData.surveyId,
        date: mapedData.date,
        slotTime: mapedData.slotTime,
        $expanded: value.$expanded,
        recipient_facts: this.getSortedByDate(value.recipient_facts),
        is_activated: value.is_activated,
        primary_relationship: value.primary_relationship,
        inviteStatus: value.inviteStatus,
        userType: value.userType,
        status: mapedData.status
      });
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(dataArr);
    this.dataSource.sort = this.sort;
  }

  getPageRecpient($event) {
    this.loadRecpientList($event.pageIndex + 1, $event.pageSize, this.searchText);
  }

  getSortedByDate(value) {
    let sortedBydate = value?.sort((a, b) => {
      return <any>new Date(b.RecipientFact.dose_date) - <any>new Date(a.RecipientFact.dose_date);
    });
    //console.log('.................'+JSON.stringify(sortedBydate));
    return sortedBydate;
  }

  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.loadRecpientList(1, this.pageSize, this.searchText);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkIFBlankLoadData(searchText) {
    if (searchText.value.trim() == '') {
      this.searchText = '';
      this.loadRecpientList(1, this.pageSize, this.searchText);
    }
  }

  loadRecpientList(pageIndex: number, pageSize: number, searchText: string) {
    this._spinner.showLoader();
    this.pageSize = pageSize;

    this._siteAdminService.getRecpientData(pageIndex, pageSize, searchText).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.recipientDataSource = res.results;
        this.mapTableData();
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page - 1;
      },
      (err) => {
        this._spinner.hideLoader();
        this.notify.showNotification('something went wrong', 'bottom', 'error');
      },
    );
  }

  openBulkAppointmentDialog(): void {
    const config = {
      height: '90%',
      width: '90%',
    };

    const dialogRef = this.dialog.open(BulkAppointmentComponent, config);
    dialogRef
      .afterClosed()
      .pipe()
      .subscribe(() => {
        this.loadRecpientList(this.pageIndex + 1, this.pageSize, '');
      });
  }

  openManagePrivateSlotsDialog(): void {
    const config = {
      height: '90%',
      width: '90%',
    };

    const dialogRef = this.dialog.open(ManagePrivateSlotsComponent, config);
    dialogRef
      .afterClosed()
      .pipe()
      .subscribe(() => { });
  }

  openDialog() {
    let listIds = [];
    let i = 0;

    let childrenArr: any[] = this.children.toArray();

    for (let obj of this.recipientDataSource) {
      let ele = childrenArr[i];
      if (ele.checked) {
        let data: any = this.dataSource.filteredData.filter((data) => {
          return data.id == ele.value;
        })[0]
        listIds.push({ name: data.name, id: data.id, dobdate: data.dob });
      }


      i = i + 1;
    }

    if (listIds.length == 0) {
      this.notify.showNotification('Please select receipients.', 'top', 'error');
      return false;
    }

    // console.log('listIds : ' + listIds);
    let config = {
      height: '80%',
      width: '80%',
      data: { selectedList: listIds },
    };

    const dialogRef = this.dialog.open(ModelBookSelectedAppointmentsComponent, config);
    //this._spinner.showLoader();
    dialogRef
      .afterClosed()
      .pipe()
      .subscribe(() => {
        this.loadRecpientList(this.pageIndex + 1, this.pageSize, '');
        //  window.location.reload();
      });
  }
  downloadMyFile(type) {
    let data: any = this.recipientDataDownload;
    if (data.failed.length > 0 || data.registered.length > 0) {
      let result: any[] = 'success' == type ? data.registered : data.failed;
      if (result.length > 0) {
        let content = this.ConvertToCSV(result, Object.keys(result[0]));

        this.downloadFile(content, 'recipient_' + type);
      }
    }
  }
  downloadRecipientTemplate() {
    this._spinner.showLoader();
    this.bulkUpload.recipientsTemplate().subscribe(
      (res: any) => {
        this._spinner.hideLoader();
        this.downloadTemplateFile(res);
      },
      (err) => {
        this._spinner.hideLoader();
        console.log('Error Response : ', err);
      },
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
          } else {

            cell = cell.toString().replace(/"/g, '""');
          }
          return JSON.stringify(cell, replacer);
        })
        .join(',');
    });
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv; charset=UTF-8' });
    saveAs(blob, 'recipient.csv');
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
        if (head == 'zipcode') {
          if (array[i][head].length >= 5) {
            line += array[i][head] + ',';
          } else if (array[i][head].length <= 4) {
            line += array[i][head].charAt(0) != '0' ? '=CHAR(048)&' + array[i][head] + ',' : array[i][head] + ',';
          } else {
            line += array[i][head] + ',';
          }

        } else {
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

  gotFileFromLocal(file: FileList) {
    this.fileToUpload = file.item(0);
    this.files = Object.keys(file).map((key) => file[key]);
    this.failureMessage = '';
    this.failureStatus = null;
    this.successStatus = null;
  }
  openUploadDialog(content): void {
    this.failureMessage = '';
    this.failureStatus = null;
    this.successStatus = null;
    this.fileToUpload = null;
    this.files = [];
    this.modalService.open(content, {
      size: 'lg',
      windowClass: 'upload-dialog',
    });
  }
  uploadCSVFile() {
    this.failureMessage = '';
    if (null != this.fileToUpload) {
      this.failureMessage = null;
      this.uploading = true;
      this._spinner.showLoader();
      this.bulkUpload
        .getData(this.fileToUpload)
        .pipe(tap(() => (this.uploading = false)))
        .subscribe(
          (res: any) => {
            this._spinner.hideLoader();
            this.recipientDataSource = res;
            this.recipientDataDownload = res;
            this.failureStatus = res.failed.length > 0 ? true : false;
            this.successStatus = res.registered.length > 0 ? true : false;
            this.resetUploadForm();
            this.loadRecpientList(this.pageIndex + 1, this.pageSize, this.searchText);
          },
          (err) => {
            this._spinner.hideLoader();
            this.uploading = false;
            let errors = err.error;

            this.failureMessage = undefined != errors && Object.keys(errors).length > 0 ? errors.message : '';
          },
        );
    } else {
      this.failureMessage = 'File is required';
      this.successStatus = null;
      this.failureStatus = null;
    }
  }
  resetUploadForm() {
    this.fileToUpload = null;
    this.files = [];
  }

  checkUncheckAll(event) {
    if (event.checked == true) this.checkAll = true;
    else this.checkAll = false;
  }

  // navToEditRecepientPage(recepientItem: any) {
  //   this._router.navigate(['/site-admin/edit-recepient', recepientItem.id]);
  // }

  /*
  addSelected(obj:string, index, element){
    if(element.checked){
    this.selectedList.push(obj);
    }else{
    this.selectedList.forEach((value,index)=>{
    if(value==obj) this.selectedList.splice(index,1);
    });
    }
    console.log("this.selectedList : "+this.selectedList);
  }
  */

  getValidDate(date: any) {
    let dt = date;
    console;
    //
    if (dt == 'Invalid date' || dt == '1900-01-01') {
      dt = '-';
    } else {
      dt = this.datepipe.transform(dt, 'MM-dd-yyyy');
    }
    return dt;
  }
  disableControl(object: any): boolean {
    let numOfDoses = object.$expanded.materials[0]?.material_no_of_doses_in_series;
    //if all visits reached
    if (object?.recipient_facts !== undefined) {
      for (let ele of object?.recipient_facts) {
        if (ele.RecipientFact.dose_in_series == numOfDoses) return true;
      }
    }
    // found booked and not cancelled
    let cancelled: boolean = true;
    for (let ele of object.$expanded?.booked_visits) {
      if (ele.visit_status !== 'cancelled') {
        cancelled = false;
      }
    }
    if (object.$expanded.booked_visits?.length > 0 && cancelled == false) return true;

    // no bookings found
    if (object.$expanded.booked_visits?.length === 0) return false;
  }

  onInvite(recipient: any, modalContent: any): void {
    this._spinner.showLoader();

    this.recipientToInvite = recipient;

    if (this.recipientToInvite.inviteStatus == 'sent') {
      let obj = {
        recipient_id: recipient.id,
        resendInvite: true,
        userType: this.recipientToInvite.userType
      }
      this.recipientToInvite.userType == "phone" ? obj['mobile_number'] = this.recipientToInvite.mobile_number : obj['email'] = this.recipientToInvite.email
      this.inviteFunc(obj)

    } else {
      this.modalService
        .open(modalContent)
        .result.then(() => {
          let obj = {
            recipient_id: recipient.id,
            userType: this.recipientToInvite.userType,
            resendInvite: recipient.inviteStatus === 'sent'
          }
          this.recipientToInvite.userType == "phone" ? obj['mobile_number'] = this.recipientToInvite.mobile_number : obj['email'] = this.recipientToInvite.email
          this.inviteFunc(obj)
        })
        .catch((err) => {
          console.log(err)
          this._spinner.hideLoader();
        });
      this._spinner.hideLoader();

    }

  }
  inviteFunc(obj) {
    this._siteAdminService.inviteRecipient(obj).subscribe((res) => {
      if (res.status === 'success') { 
        //this.notify.showNotification(res.message, 'top', 'success');

      } else {
        if (res.hasOwnProperty('statusCode') && res.statusCode===400) {
          this.notify.showNotification(res.message, 'top', 'error');
  
        }
      }
      this.loadRecpientList(this.pageIndex + 1, this.pageSize, this.searchText);
    })
  }

  appointmentClick(recipient): void {
    this.adminService.getRecipientVisits(recipient.id).subscribe((visits) => {
      if (visits.length) {
        this._router.navigate(['/site-admin/recipient-appointment', recipient.id]);
      } else {
        localStorage.setItem('recepientdob', recipient.dob);
        this._router.navigate(['site-admin', 'book-appointment', recipient.id]);
      }
    });
  }
}
