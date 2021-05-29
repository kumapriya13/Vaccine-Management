import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthManageService } from '.';
//import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ReceptionistService {
  private apiUrl = environment.apiUrl;
  private ssoUrL = environment.sso_url;
  receptionist: any = {};
  selectedSiteId: string = '';
  public _userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  datePipeString: any;
  recep: any = {};

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private authManageService: AuthManageService
    //// private datePipe: DatePipe
  ) {
    //this.datePipeString = datePipe.transform(Date.now(),'yyyy-MM-dd');
    this.datePipeString = new Date().toLocaleTimeString;
    console.log(this.datePipeString)
  }

  localStorage_getReceptionistInfo() {;
    let vacUser = localStorage.getItem('receptionist_admin-user');
    return JSON.parse(vacUser);
  }

  getReceptionistInfo() {
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));
    let url = `${this.apiUrl}vaccinator/item`;

    let reqData = { id: this.receptionist.user_id };
    return this._http
      .post<any>(url, reqData)
      .pipe(
        map((response) => {
          this._userProfile.next(response);
          localStorage.setItem('receptionist_admin-user', JSON.stringify(response));
          return response;
        })
      );
  }

  getReceptionistVisits(searchText: string,page:number) {
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));
   
    this.recep = this.authManageService.getLoggedInUser();    
    if(!localStorage.getItem('selectedSiteId')){
      this.selectedSiteId = this.recep.site_ids[0];
    }else{
      this.selectedSiteId = localStorage.getItem('selectedSiteId');
    }
    let dateObj = new Date();
    let year = dateObj.getFullYear();
    let month: any = dateObj.getMonth() + 1;
    let date: any = dateObj.getDate();
    let hrs: any = dateObj.getHours() <= 9 ? "0" + dateObj.getHours() : dateObj.getHours();
    //console.log(min);
    let min: any = dateObj.getMinutes() <= 9 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
    //console.log(min);
    month = month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    date = date.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let reqData = {
      siteId: this.selectedSiteId ,//this.receptionist.site_ids[0],
      startDate: String(year + '-' + month + '-' + date),
      endDate: String(year + '-' + month + '-' + date),
      "paginationOptions": {
        "checkedIn_page": page,
        "checkedIn_pageLength": 10,
        "upcoming_page": page,
        "upcoming_pageLength": 10,
        "observation_page": page,
        "observation_pageLength": 10,
        "initiated_page": page,
        "initiated_pageLength": 10,
        "completed_page": page,
        "completed_pageLength": 10,
        "missed_page": page,
        "missed_pageLength": 10
      }
    }

    if (searchText.trim() != '') {
      reqData['q'] = searchText.trim();
    }

    let url = `${this.apiUrl}vaccinator/visits`;

    return this._http.post<any>(url, reqData);
  }

  getchecklist(visitId: string): Observable<any[]> {
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));
    const url = `${this.apiUrl}visit/checklist/get`;
    const checkListReq = { visitId: visitId };

    return this._http
      .post<any>(url, checkListReq)
      .pipe(map((res) => res.checklist));
  }

  identificationData(reqData):Observable<any>{
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));

    const url = `${this.apiUrl}vaccinator/visit/start`;
    return this._http.post<any>(url, reqData);
  }

  saveAnswerList(reqData): Observable<any> {
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));

    const url = `${this.apiUrl}visit/checklist/save`;
    return this._http.post<any>(url, reqData);
  }

  getMaterialList(): Observable<any> {
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));    
    this.recep = this.authManageService.getLoggedInUser();    
    if(!localStorage.getItem('selectedSiteId')){
      this.selectedSiteId = this.recep.site_ids[0];
    }else{
      this.selectedSiteId = localStorage.getItem('selectedSiteId');
    }

    let reqObj = {
      site_id: this.selectedSiteId,
    };


    const url = `${this.apiUrl}materialBatch/list`;
    return this._http.post<any>(url, reqObj);
  }

  visitUpdateAdminstrationDetails(reqData: any = {}) {
    this.receptionist = JSON.parse(localStorage.getItem('receptionist_admin-token'));

    reqData['vaccinator'] = this.receptionist.user_id;
    const url = `${this.apiUrl}visit/updateAdminstrationDetails`;
    return this._http.post<any>(url, reqData);
  }

  //receptionist_admin-token
  sitesearchbyZipId(zipId: number): Observable<any> {
    const url = `${this.apiUrl}site/searchbyZipId`;
    const reqBody: object = { zip: zipId };
    return this._http.post<any>(url, reqBody).pipe(
      map(x => {
        return x.Response;
      })
    );

  }

  getStaticDataAppointment() {
    const url = `${this.apiUrl}receptionist/visits`;

    const receptionsist = JSON.parse(localStorage.getItem('receptionist_admin-token'));
    this.recep = this.authManageService.getLoggedInUser();    
    if(!localStorage.getItem('selectedSiteId')){
      this.selectedSiteId = this.recep.site_ids[0];
    }else{
      this.selectedSiteId = localStorage.getItem('selectedSiteId');
    }
    const reqObj: object = {
      //"siteId": receptionsist.site_ids[0],
      "siteId": this.selectedSiteId,
      "startDate": "2021-03-12",
      "endDate": "2021-02-12",
      "currentTime": "2021-02-12T13:22:00"
    };

    return this._http.post<any>(url, reqObj);
  }

  getRecepientData(reqobj: any) {
    const url = `${this.apiUrl}manage/recipient/search`;

    return this._http.post<any>(url, reqobj);

  }

  getUserById(recipient_id?: string) {
    let url = `${this.apiUrl}recipient/profile`;
    return this._http.post<any>(url, { recipient_id });
  }

  saveRecipientProfileOnly(reqData: any = {}) {
    let url = `${this.apiUrl}recipient/profile/save`;
    return this._http.post<any>(url, reqData);
  }


  saveRecipientProfile(reqData: any = {}) {
    let url = `${this.apiUrl}manage/recipient/save`;
    return this._http.post<any>(url, reqData);
  }

  saveWalkin(reqData: any) {
    let url = this.apiUrl + 'manage/recipient/create';
    const siteadminInfo = this.authManageService.getLoggedInUser();
    return this._http.post<any>(url, reqData);
  }

  patchRecipients(q: string, is_allow_private: boolean) {
    let url = `${this.apiUrl}manage/recipient/patchRecipients`;
    return this._http.post<any>(url, {
      q,
      is_allow_private
    });
  }


  checkInVisitStatus(reqData: any) {
    let url = `${this.apiUrl}visit/status/checkIn`;
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

    return this._http.post<any>(url, reqRecipient);
  }

  getRecipientVisits(recipientId) {
    let url = `${this.apiUrl}visit/search`;

    let reqBody ={
      page: 1,
      pageLength:10,
      criteria: {
          recipient_id: recipientId
       },
      sort: 'create_time'
    }
    return this._http.post<any>(url, reqBody).pipe(map(pipeRes => {
      pipeRes.results = pipeRes.results.filter(value => {
        let returnValue = true;
        if (value['visit_status']) {
          returnValue = (<string>value['visit_status']).toLowerCase() == "cancelled" ? false : returnValue;
        }
        return returnValue;
      })

      while (pipeRes.results.length > 2) {
        pipeRes.results.splice(0, 1);
      }
          return pipeRes;
          
    }));;
  }


}
