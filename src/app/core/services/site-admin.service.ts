import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthManageService } from './auth';
import { AdminToken } from '../constants';
import { VisitScheduleReq } from 'src/app/features/site-admin/models/site-admin.model';

@Injectable({
  providedIn: 'root',
})
export class SiteAdminService {
  private apiUrl = environment.apiUrl;
  vaccinator: any = {};
  siteAdmin: any = {};

  public _userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private _http: HttpClient,
    private authManageService: AuthManageService
  ) {}

  CheckUserName(data) {
    let url = this.apiUrl + 'admin/checkUserAvailable';
    return this._http.post<any>(url, { user: data });
  }
  receptionistUserData(reqData) {
    let url = reqData.id
      ? this.apiUrl + 'vaccinator/save'
      : this.apiUrl + 'admin/invite/receptionist';
    reqData.site_ids = this.authManageService.getLoggedInUser()?.site_ids;
    return this._http.post<any>(url, reqData);
  }
  getDailySiteData(
    page: number,
    pageLength: number,
    searchText: string = ''
  ): Observable<any> {
    let siteIds = this.authManageService.getLoggedInUser()?.site_ids.toString();
    const reqRecipient = {
      site_id: siteIds,
      date: searchText,
    };
    let url = this.apiUrl + 'reporting/dailySiteVaccinationReport';
    return this._http.post<any>(url, reqRecipient);
  }
  getReceptionistDataUser(
    page: number,
    pageLength: number,
    searchText: string = ''
  ): Observable<any> {
    let siteIds = this.authManageService.getLoggedInUser()?.site_ids.toString();
    const reqRecipient = {
      page: page,
      pageLength: pageLength,
      q:
        `user_type=receptionist,site_ids=${siteIds}` +
        (searchText.trim() != '' ? ' AND user_wildcard=' + searchText : ''),
      sort: '',
    };

    let url = this.apiUrl + 'manage/user/search';
    return this._http.post<any>(url, reqRecipient);
  }

  getRecipientUserId(reqObj: any): Observable<any> {
    const url = `${this.apiUrl}manage/user/details`;
    return this._http.post<any>(url, { id: reqObj });
  }
  saveSeat(reqObj: any): Observable<any> {
    const url = `${this.apiUrl}site/generateSeatsForSite`;
    return this._http.post<any>(url, reqObj);
  }

  editSeat(reqObj: any): Observable<any> {
    const url = `${this.apiUrl}seat/save`;
    return this._http.post<any>(url, reqObj);
  }

  getSeats(
    page: number,
    pageLength: number,
    searchText: string = ''
  ): Observable<any> {
    let loggedinUser: any = this.authManageService.getLoggedInUser();
    const reqSeats = {
      site_id: loggedinUser.site_ids[0],
      page: page,
      pageLength: pageLength,
      q: searchText,
    };
    const url = `${this.apiUrl}seat/list`;
    return this._http.post<any>(url, reqSeats);
  }

  getSeat(id: string) {
    const seatReq = { id: id };
    const url = `${this.apiUrl}seat/get`;
    return this._http.post<any>(url, seatReq);
  }

  getVaccinatorList(
    page: number,
    pageLength: number,
    searchText: string = ''
  ): Observable<any> {
    const reqBodyVaccinator = {
      siteIds: this.authManageService.getLoggedInUser()?.site_ids,
      page: page,
      pageLength: pageLength,
      vaccinatorInfo: searchText,
    };
    const url = `${this.apiUrl}vaccinator/search`;
    return this._http.post<any>(url, reqBodyVaccinator);
  }
  addVaccinator(formValue: any, id?: string): Observable<any> {
    const siteadminInfo = this.authManageService.getLoggedInUser();

    const reqAddVaccObj = {
      id: id,
      user_name: formValue.userName,
      site_ids: siteadminInfo.site_ids,
      provider_id:
        siteadminInfo.provider_id || '99215884-7482-4cf8-b300-3017508ddeca',
      lname: formValue.lastName,
      fname: formValue.firstName,
      dob: moment(formValue.dob).format('YYYY-MM-DD'),
      gender: formValue.gender,
      email: formValue.email,
      mobile_number: formValue.phone,
      address1: formValue.address1,
      address2: formValue.address2,
      address3: formValue.address3,
      city: formValue.city,
      zip: formValue.zip,
      country: formValue.country,
      state: formValue.state,
    };

    let url = id
      ? this.apiUrl + 'vaccinator/save'
      : `${this.apiUrl}admin/invite/vaccinator`;
    return this._http.post<any>(url, reqAddVaccObj);
  }

  addMaterial(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'materialBatch/save';

    return this._http.post<any>(url, reqObj);
  }

  getMaterialList(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'materialBatch/list';
    return this._http.post<any>(url, reqObj);
  }

  getMaterial(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'materialBatch/get';

    return this._http.post<any>(url, reqObj);
  }

  deleteMaterial(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'materialBatch/delete';

    return this._http.post<any>(url, reqObj);
  }

  deleteSeat(id: string): Observable<any> {
    const reqDelete = { id: id };
    const siteadminInfo = this.authManageService.getLoggedInUser();
    const url = `${this.apiUrl}seat/delete`;
    return this._http.post<any[]>(url, reqDelete);
  }

  deleteVaccinator(id: string): Observable<any> {
    const reqDelete = { id: id };
    const siteadminInfo = this.authManageService.getLoggedInUser();
    const url = `${this.apiUrl}vaccinator/delete`;
    return this._http.post<any[]>(url, reqDelete);
  }
  getUserStatus(data) {
    let reqRecipient = {
      user_id: data.id,
    };
    const siteadminInfo = this.authManageService.getLoggedInUser();
    let url = !data.is_disabled
      ? this.apiUrl + 'manage/user/disable'
      : this.apiUrl + 'manage/user/enable';
    return this._http.post<any>(url, reqRecipient);
  }
  getVaccinatorById(id: string): Observable<any> {
    const reqSeats = { id: id };
    const siteadminInfo = this.authManageService.getLoggedInUser();
    const url = `${this.apiUrl}vaccinator/item`;
    return this._http.post<any>(url, reqSeats);
  }

  saveWalkin(reqData: any) {
    let url = this.apiUrl + 'manage/recipient/create';
    const siteadminInfo = this.authManageService.getLoggedInUser();
    return this._http.post<any>(url, reqData);
  }

  getRecpientData(page: number, pageLength: number, searchText: string = '') {
    searchText = searchText.trim();

    const reqRecipient = {
      page: page,
      pageLength: pageLength,
      q: searchText ? `recipient_wildcard=${searchText} OR recipient_ticket_number_wildcard=${searchText}` : '',
      sort: '',
    };
    let url = this.apiUrl + 'manage/recipient/search';
    const siteadminInfo = this.authManageService.getLoggedInUser();
    return this._http.post<any>(url, reqRecipient);
  }

  inviteRecipient(object: any): Observable<any> {
    let url = this.apiUrl + 'manage/recipient/invite';
    return this._http.post<any>(url, object);
  }

  bulkUploadRecipients(file: File): Observable<any> {
    let vaccinator: any = {};
    vaccinator = JSON.parse(localStorage.getItem('vaccinator-token'));
    //NOTE: very bad.  Need to update to use site_admin-token   xxxxxx

    let url = this.apiUrl + 'load/recipients/';
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this._http.post<any>(url, formData);
  }

  localStorage_getVaccinatorInfo() {
    let vacUser = localStorage.getItem('vaccinator-user');
    return JSON.parse(vacUser);
  }

  getDailySiteScheduleReport(date: Date): Observable<any> {
    const reqData = {
      site_id: this.authManageService.getLoggedInUser()['site_ids'][0],
      date: moment(date).format('YYYY-MM-DD'),
    }
    const url = `${this.apiUrl}reporting/dailySiteScheduleReport`;
    return this._http.post<any>(url, reqData).pipe(map(({result}) => result));
  }

  getDailyInventoryReport(date: Date): Observable<any> {
    const reqData = {
      siteId: this.authManageService.getLoggedInUser()['site_ids'][0],
      vaccineDate: moment(date).format('YYYY-MM-DD'),
    }
    const url = `${this.apiUrl}reporting/dailyUCReport`;
    return this._http.post<any>(url, reqData).pipe(map(({result}) => result));
  }

  getVaccinatorInfo() {
    this.vaccinator = JSON.parse(localStorage.getItem('vaccinator-token'));
    let url = `${this.apiUrl}vaccinator/item`;
    let reqData = { id: this.vaccinator.user_id };
    return this._http.post<any>(url, reqData).pipe(
      map((response) => {
        this._userProfile.next(response);
        localStorage.setItem('vaccinator-user', JSON.stringify(response));
        return response;
      })
    );
  }

  //-- For vaccinator-schedule
  getVaccinatorVisits(reqObj: any): Observable<any> {
    /* let dateObj = new Date();
    let year = dateObj.getFullYear();
    let month: any = dateObj.getMonth() + 1;
    let date: any = dateObj.getDate();

    let currentTime = String(year + '-' + month + '-' + date+'T'+dateObj.getHours()+':'+dateObj.getMinutes()+':'+dateObj.getSeconds());
    month = month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    date = date.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    //console.clear();
   // console.log(this.vaccinator);
   // console.log('currentTime: '+currentTime);
    let reqData;
     if(ticketNo==''){
            reqData = {
              siteId: this.vaccinator.site_ids[0],
              startDate: String(year + '-' + month + '-' + date),
              endDate: String(year + '-' + month + '-' + date),
              currentTime: currentTime
            };
     }else{
          reqData = {
            siteId: this.vaccinator.site_ids[0],
            startDate: String(year + '-' + month + '-' + date),
            endDate: String(year + '-' + month + '-' + date),
            ticket_number : ticketNo,
            currentTime : currentTime
          };
     }

    let url = `${this.apiUrl}vaccinator/visits`;
    return this._http.post<any>(url, reqData);
  }
  //dkp end
    console.log(this.site_admin);
    let reqData = {
      "siteId": this.site_admin.site_ids[0],
      "startDate": String(year + "-" + month + "-" + date),
      "endDate": String(year + "-" + month + "-" + date)
    }; */

    const url = `${this.apiUrl}vaccinator/visits`;
    return this._http.post<any>(url, reqObj);
  }
  //-- end

  getMaterialListNames() {
    const url = `${this.apiUrl}material/search`;
    const body = {
      q: '',
      page: 1,
      pageLength: 1000,
    };
    return this._http.post<any>(url, body);
  }
  addSchedule(reqObj: any = {}) {
    const url = `${this.apiUrl}seat/save`;
    return this._http.post<any>(url, reqObj);
  }

  getPreviewSchedule(reqObj: any = {}) {
    const url = `${this.apiUrl}site/previewSlotMasters`;
    return this._http.post<any>(url, reqObj);
  }

  generateSlotsForDateRange(reqObj: any = {}) {
    const url = `${this.apiUrl}site/generateSlotsForDateRange`;
    return this._http.post<any>(url, reqObj);
  }

  generateSlotsForDateRangeBatch(reqObj: any = {}) {
    const url = `${this.apiUrl}site/generateSlotsForDateRangeBatch`;
    return this._http.post<any>(url, reqObj);
  }

  searchSlotsForDateRangeBatch(reqObj: any = {}) {
    const url = `${this.apiUrl}site/searchSlotsForDateRangeBatch`;
    return this._http.post<any>(url, reqObj);
  }

  getSlotAdminAvailableValues(reqObj: any = {}) {
    const url = `${this.apiUrl}slot/adminAvailableValues`;
    return this._http.post<any>(url, reqObj);
  }

  siteAdminScheduleVisitByDateTime(reqObj: any = {}) {
    const url = `${this.apiUrl}site/adminScheduleVisitByDateTime`;
    return this._http.post<any>(url, reqObj);
  }

  slotSearchSchedule(filter: any, page: number = 1, pageLength: number = 1000) {
    const url = `${this.apiUrl}slot/slotSearchSchedule`;
    return this._http.post<any>(url, {
      ...filter,
      siteIds: this.authManageService.getLoggedInUser().site_ids,
      page,
      pageLength
    });
  }

  moveSlotVisitSlotList(slotIds: string[], fromStartDateTime: string, toStartDate: string) {
    const url = `${this.apiUrl}slot/moveSlotVisitSlotList`;
    return this._http.post<any>(url, {
      slotIds,
      fromStartDateTime,
      toStartDate,
    });
  }

  cancelSlotVisitSlotList(slotIds: string[]) {
    const url = `${this.apiUrl}slot/cancelSlotVisitSlotList`;
    return this._http.post<any>(url, {
      slotIds,
    });
  }

  public loadValues(
    entity_name: string,
    distinct_values: string[],
    max: string[],
    min: string[]
  ): Observable<any> {
    const url = `${this.apiUrl}values`;

    const body = {
      value_definitions: [
        {
          entity_name,
          property_definitions: {
            distinct_values,
            max,
            min,
          },
        },
      ],
    };

    return this._http.post<any>(url, body);
  }

  public searchRecipients(
    q: string,
    page: number,
    pageLength: number,
    sort?: string,
    onlyFirstAppointment?: boolean,
  ): Observable<any> {
    const url = `${this.apiUrl}manage/recipient/search`;

    const body = {
      q,
      page,
      pageLength,
      sort,
      onlyFirstAppointment
    };
    return this._http.post<any>(url, body);
  }

  public checkRecipientDuplicate(recipient: any): Observable<any> {
    const query = `(fname:"${recipient.fname}" AND lname:"${recipient.lname}" AND dob="${recipient.dob}") OR (email:"${recipient.email}" AND mobile_number="${recipient.mobile_number}")`;
    return this.searchRecipients(query, 1, 1)
  }

  public getVaccines(): Observable<any> {
    const url = `${this.apiUrl}material/search`;

    const body = {
      q: 'is_active=true',
    };

    return this._http.post<any>(url, body).pipe(map((res) => res.results));
  }

  downloadFile(data, filename = 'data', header) {
    let csvData = this.ConvertToCSV(data, header);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
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
  bookSelectedAppointments(reqObj: any) {
    const url = `${this.apiUrl}slot/scheduleVisitBulk`;
    return this._http.post<any>(url, reqObj);
  }

  getScheduleVisit(req: VisitScheduleReq): Observable<any> {
    return this._http
      .post<any>(`${this.apiUrl}vaccinator/visits/schedule`, req)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  checkSlotDate(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/adminAvailable';
    return this._http.post<any>(url, reqObj);
  }

  // inside sit-admin/page-dashboard/appointments
  slotWeeklyVacsReport(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'slot/weeklyVacsReport';
    reqObj.siteId = this.authManageService.getLoggedInUser()['site_ids'][0];
    return this._http.post<any>(url, reqObj);
  }

   // inside sit-admin/page-dashboard/vaccinator
   slotWeeklyVaccinatorReport(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'slot/weeklyVaccinatorReport';
    reqObj.siteId = this.authManageService.getLoggedInUser()['site_ids'][0];
    return this._http.post<any>(url, reqObj);
  }

  changeSeatAllocationType(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/bulkUpdateAllocationType';
    return this._http.post<any>(url, reqObj);
  }

  public getMaterialBatchCount(reqObj: any): Observable<any>{
    const url = this.apiUrl + 'materialBatch/count';
    return this._http.post<any>(url, reqObj);
  }

}
