import { Location, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import {
  ModelBookSelectedAppointmentsComponent,
} from 'src/app/shared/modals/model-book-selected-appointments/model-book-selected-appointments.component';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { AuthManageService, ReceptionistService, SiteAdminService } from '../../../core';
import { AdminService } from '../../../core/services/admin.service';


export interface PeriodicElement {
  input_check_box: any,
  name: string,
  email: string,
  county: string,
  zip: string,
  id: string
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-page-walk-in',
  templateUrl: './page-walk-in.component.html',
  styleUrls: ['./page-walk-in.component.scss']
})
export class PageWalkInComponent implements AfterViewInit, OnDestroy {
  opt = [10, 25, 50, 100];
  site_ids: any[];
  recpientInfo: any;
  appForm: FormGroup;
  recipientToInvite: any;
  @ViewChildren('children') children: QueryList<NgModel>;

  displayedColumns: string[] = ['input_check_box', 'name', 'dob', 'date', 'slottime', 'vaccine', 'dose', 'survey', 'status', 'id'];

  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  recipientDataSource: any[] = [];
  searchText: string = '';
  checkAll: boolean = false;
  selectedList = [];
  sites = [];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedSiteId: string;

  @ViewChild('searchInput') searchInput: ElementRef;

  private readonly RECEPTIONIST_APPOINTMENT_FILTER_KEY = 'receptionist-appoinment-search-filter';

  constructor(
    private adminService: AdminService,
    private _receptionistService: ReceptionistService,
    private notify: NotificationService,
    private _router: Router,
    private _location: Location,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _spinner: SpinnerService,
    private _siteAdminService: SiteAdminService,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private authManageService: AuthManageService) {
    this.appForm = this.fb.group({
      checkArray: this.fb.array([])
    })
  }

  ngAfterViewInit(): void {
    const storageValue = localStorage.getItem(this.RECEPTIONIST_APPOINTMENT_FILTER_KEY);
    const storedSearchText = storageValue == null ? '' : storageValue;
    this.searchText = storedSearchText;
    this.searchInput.nativeElement.value = storedSearchText;
    this.loadRecpientList(this.pageIndex + 1, this.pageSize, this.searchText);
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.RECEPTIONIST_APPOINTMENT_FILTER_KEY);
    if (this._router.url.indexOf('/receptionist/edit-info-user') != -1) {
      localStorage.setItem(this.RECEPTIONIST_APPOINTMENT_FILTER_KEY, this.searchText);
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
            mapedData = this.mapKeys(recipient_facts, materials, '');
          } else {
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

  getSortedByDate(value) {
    let sortedBydate = value?.sort((a, b) => {
      return <any>new Date(b.RecipientFact.dose_date) - <any>new Date(a.RecipientFact.dose_date);
    });
    //console.log('.................'+JSON.stringify(sortedBydate));
    return sortedBydate;
  }

  getPageRecpient($event) {

    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.loadRecpientList($event.pageIndex + 1, $event.pageSize, this.searchText);
  }

  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.loadRecpientList(1, this.pageSize, this.searchText);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkIFBlankLoadData(searchText) {
    if (searchText.value.trim() == '') {
      this.searchText = ''
      this.loadRecpientList(1, this.pageSize, this.searchText);
    }
  }

  loadRecpientList(pageIndex: number, pageSize: number, searchText: string) {
    this._spinner.showLoader();
    this._receptionistService.getRecpientData(pageIndex, pageSize, searchText).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.recipientDataSource = res.results;
        this.mapTableData();
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page - 1;

      },
      (err) => {
        this._spinner.hideLoader();
        this.notify.showNotification('something went wrong', 'bottom', 'error')
      }
    );
  }

  openDialog() {
    let listIds = [];
    let i = 0;
    let childrenArr: any[] = this.children.toArray();
    for (let obj of this.recipientDataSource) {
      let ele = childrenArr[i].nativeElement;
      if (ele.checked) {
        let data: any = this.dataSource.filteredData.filter((data) => {
          return data.id == ele.value;
        })[0]
        listIds.push({ name: data.name, id: data.id, dobdate: data.dob });
      }


      i = i + 1;
    }

    if (listIds.length == 0) {
      this.notify.showNotification("Please select receipients.", "top", 'error');
      return false;
    }

    let config = {
      height: '80%',
      width: '80%',
      data: { selectedList: listIds }
    };

    const dialogRef = this.dialog.open(ModelBookSelectedAppointmentsComponent, config);
    dialogRef.afterClosed().pipe().subscribe(() => {
      this.loadRecpientList(this.pageIndex + 1, this.pageSize, '');
      //  window.location.reload();
    });
  }

  checkUncheckAll(ele) {
    if (ele.checked == true)
      this.checkAll = true;
    else
      this.checkAll = false;
  }

  disableControl(object: any): boolean {
    let numOfDoses = object.$expanded.materials[0]?.material_no_of_doses_in_series;
    //if all visits reached
    if (object?.recipient_facts !== undefined) {
      for (let ele of object?.recipient_facts) {
        if (ele.RecipientFact.dose_in_series == numOfDoses)
          return true;
      }
    }
    // found booked and not cancelled
    let cancelled: boolean = true;
    for (let ele of object.$expanded?.booked_visits) {
      if (ele.visit_status !== 'cancelled') {
        cancelled = false;
      }
    }
    if (object.$expanded.booked_visits?.length > 0 && cancelled == false)
      return true;

    // no bookings found
    if (object.$expanded.booked_visits?.length === 0)
      return false;
  }

  getValidDate(date: any) {
    let dt = date;
    //
    if (dt == 'Invalid date' || dt == '1900-01-01') {
      dt = '-'
    }
    else {
      dt = this.datepipe.transform(dt, 'MM-dd-yyyy');
    }
    return dt;
  }

  appointmentClick(recipient): void {
    this.adminService.getRecipientVisits(recipient.id).subscribe((visits) => {
      if (visits.length) {
        this._router.navigate(['/receptionist/recipient-appointment', recipient.id]);
      } else {
        localStorage.setItem('recepientdob', recipient.dob);
        this._router.navigate(['receptionist', 'book-appointment', recipient.id]);
      }
    });
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
          this._spinner.hideLoader();
        });
      this._spinner.hideLoader();

    }

  }
  inviteFunc(obj) {
    this._siteAdminService.inviteRecipient(obj).subscribe((res) => {
      if (res.status == 'success') {
        this.notify.showNotification(res.message, 'top', 'success');

      }
      this.loadRecpientList(this.pageIndex + 1, this.pageSize, this.searchText);
    }, (err: any) => {
      this._spinner.hideLoader();
      if (err.error.hasOwnProperty('code') && err.error.code == "UsernameExistsException" && err.error.hasOwnProperty('message')) {
        let errmsg = err.error.message ? err.error.message : "something went wrong";
        this.notify.showNotification(errmsg, 'top', 'error')
      } else {
        this.notify.showNotification('something went wrong', 'top', 'error')
      }

    })
  }
}
