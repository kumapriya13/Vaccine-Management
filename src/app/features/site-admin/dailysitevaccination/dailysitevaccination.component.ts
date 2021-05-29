import { AuthManageService } from './../../../core/services/auth/auth-manage.service';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DatePipe } from '@angular/common';
import { SiteAdminService } from '../../../core';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ExcelService } from '../../../core/services/excel.service';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  mobile_number: string;
  gender: string;
  dob: string;
  lot_number: string;
  vaccine: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-dailysitevaccination',
  templateUrl: './dailysitevaccination.component.html',
  styleUrls: ['./dailysitevaccination.component.scss'],
})
export class DailysitevaccinationComponent implements OnInit {
  site_ids: any[];
  receptionistInfo: any;
  downloadShow: boolean = true;
  minDate = new Date(1870, 0, 1);
  maxDate = new Date();

  displayedColumns: string[] = ['name', 'dob', 'gender', 'mobile_number', 'vaccine', 'lot_number'];

  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  downloadDateSource: any[] = [];
  seatsDataSource: any[] = [];
  seatData: any;
  searchText: string = '';
  date1 = new FormControl(new Date())

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private _router: Router,
    private _location: Location,
    private authManageService: AuthManageService,
    private _spinner: SpinnerService,
    private datepipe: DatePipe,
    private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.searchText = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.site_ids = this.authManageService.getLoggedInUser()['site_ids'];
    this.loadDailySiteList(this.pageIndex + 1, this.pageSize, this.searchText);
  }

  backClicked() {
    this._location.back();
  }
  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
  mapTableData() {
    let dataArr = [];
    this.seatsDataSource.forEach((value: any) => {
      dataArr.push({
        name: value.PATIENT_FIRST_NAME + ' ' + value.PATIENT_LAST_NAME,
        mobile_number: value.PHONE_NUMBER,
        gender: value.ADMINISTRATIVE_SEX ? this.titleCaseWord(value.ADMINISTRATIVE_SEX) : '',
        dob: value.PATIENT_DATE_OF_BIRTH_YYYYMMDD
          ? this.datepipe.transform(value.PATIENT_DATE_OF_BIRTH_YYYYMMDD, 'MM/dd/yyyy')
          : '',
        lot_number: value.VACCINE_LOT_NUMBER,
        vaccine: value.VACCINE_MANUFACTURER_NAME,
      });
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(dataArr);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getPageReceptionist($event) {
    this.loadDailySiteList($event.pageIndex + 1, $event.pageSize, this.searchText);
  }

  getValidDate(date: any) {
    let dt = date ? this.datepipe.transform(date, 'yyyy-MM-dd') : '';
    //
    if (dt == 'Invalid date' || dt == '1900-01-01' || dt == '') {
      dt = '-';
    } else {
      dt = this.datepipe.transform(dt, 'MM-dd-yyyy');
    }
    return dt;
  }
  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.loadDailySiteList(1, this.pageSize, this.searchText);
  }

  searchByFilterText(searchInput) {
    searchInput = this.datepipe.transform(searchInput, 'yyyy-MM-dd');
    this.searchText = searchInput;
    this.loadDailySiteList(1, this.pageSize, searchInput);
  }

  loadDailySiteList(pageIndex: number, pageSize: number, searchText: string) {
    this._spinner.showLoader();
    this._siteAdminService.getDailySiteData(pageIndex, pageSize, searchText).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.seatsDataSource = res.result;
        this.downloadDateSource = res.result;
        if (this.seatsDataSource.length) {
          this.downloadShow = true;
          this.mapTableData();
        } else {
          this.downloadShow = false;
          this.mapTableData();
          // this.seatsDataSource =[];
          this.notify.showNotification('No Record Found', 'top', 'success');
          return;
        }
        // this.totalCount = res.resultMetadata.count;
        // this.pageIndex = res.resultMetadata.page - 1;
      },
      (err) => {
        this._spinner.hideLoader();
        this.notify.showNotification('something went wrong', 'bottom', 'error');
      },
    );
  }
  downloadRecipientTemplate() {
    if (this.downloadDateSource.length > 0) {
      this.downloadTemplateFile(this.downloadDateSource);
    } else {
      this.downloadShow = false;
    }
  }

  downloadTemplateFile(data: any) {
    data = data.map((row) => {
      const newRow = {
        NJIIS_Facility_ID: row.NJIIS_FACILITY_ID,
        Patient_Last_Name: row.PATIENT_LAST_NAME,
        Patient_First_Name: row.PATIENT_FIRST_NAME,
        Patient_Date_of_Birth_YYYYMMDD: this.getDatevalid(row.PATIENT_DATE_OF_BIRTH_YYYYMMDD),
        Administrative_Sex: row.ADMINISTRATIVE_SEX,
        Race: row.RACE,
        Patient_Address_Street_or_Mailing_Address: row.PATIENT_ADDRESS_STREET_OR_MAILING_ADDRESS,
        Patient_Address_line_2:
          row.PATIENT_ADDRESS_LINE_2 + (row.PATIENT_ADDRESS_LINE_3 ? `, ${row.PATIENT_ADDRESS_LINE_3}` : ''),
        Patient_Address_City: row.PATIENT_ADDRESS_CITY,
        Patient_Address_State: row.PATIENT_ADDRESS_STATE,
        Patient_Address_Zip: row.PATIENT_ADDRESS_ZIP,
        Patient_Address_Type: row.PATIENT_ADDRESS_TYPE,
        Phone_Number: row.PHONE_NUMBER,
        Ethnic_Group: row.ETHNIC_GROUP,
        Date_of_Administration_YYYYMMDD: row.DATE_OF_ADMINISTRATION_YYYYMMDD,
        Vaccine_Administered_Amount: row.VACCINE_ADMINISTERED_AMOUNT,
        Vaccine_Lot_Number: row.VACCINE_LOT_NUMBER,
        Vaccine_Expiration_Date_YYYYMMDD: row.VACCINE_EXPIRATION_DATE_YYYYMMDD,
        Vaccine_Manufacturer_Name: row.VACCINE_MANUFACTURER_NAME,
        Vaccine_Route_of_Administration: row.VACCINE_ROUTE_OF_ADMINISTRATION,
        Vaccine_Administration_Site: row.VACCINE_ADMINISTRATION_SITE,
      };
      if (newRow.Phone_Number && (newRow.Phone_Number.startsWith('1') || newRow.Phone_Number.startsWith('+1'))) {
        newRow.Phone_Number = newRow.Phone_Number.slice(-10);
      }
      return newRow;
    });


    this.excelService.exportAsExcelFile(data, `Dailysite_Report_${this.searchText}.xlsx`)
  }

  getDatevalid(date: any) {
    let dt = date;
    //
    if (dt == 'Invalid date' || dt == '1900-01-01' || dt == '') {
      dt = '';
    } else {
      dt = moment(dt).format('YYYYMMDD');
    }
    return dt;
  }
}
