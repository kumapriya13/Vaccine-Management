import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { AuthManageService } from './auth/auth-manage.service';
@Injectable({
  providedIn: 'root',
})
export class VaccinatorService {
  vaccinator: any = {};
  private apiUrl = environment.apiUrl;
  public _userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  datePipeString: string;
  // public userProfile: Observable<any> = this._userProfile.asObservable();
  selectedSiteId: string = '';

  constructor(
    private _http: HttpClient,
    private authManageService: AuthManageService
  ) {
    this.vaccinator = this.authManageService.getLoggedInUser();
    // this.datePipeString = datePipe.transform(Date.now(),'yyyy-MM-dd');
  }

  localStorage_getVaccinatorInfo() {
    let vacUser = localStorage.getItem('vaccinator-user');
    return JSON.parse(vacUser);
  }

  getVaccinatorInfo() {
    this.vaccinator = this.authManageService.getLoggedInUser();
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

  getVaccinatorVisits(searchText: string, page: number, selectedDate = null) {
    selectedDate = selectedDate == null ? new Date() : selectedDate;
    this.vaccinator = this.authManageService.getLoggedInUser();
    //TODO:- must be removed as this not the correct way 
    if(!localStorage.getItem('selectedSiteId')){
      this.selectedSiteId = this.vaccinator.site_ids[0];
    }else{
      this.selectedSiteId = localStorage.getItem('selectedSiteId');
    }
   // this.selectedSiteId = this.authManageService.getLoggedInUser().sites[0].site_id;
    console.log('this.selectedSiteId from loggedinuser',this.selectedSiteId)
    let reqData = {
      siteId: this.selectedSiteId, //this.vaccinator.site_ids[0],
      startDate: moment(selectedDate).format('YYYY-MM-DD'),
      endDate: moment(selectedDate).format('YYYY-MM-DD'),
      q: searchText ? searchText.toString().trim() : '',
      // as per ML, it is not required
      //currentTime: currentTime,
      paginationOptions: {
        checkedIn_page: page,
        checkedIn_pageLength: 10,
        upcoming_page: page,
        upcoming_pageLength: 10,
        observation_page: page,
        observation_pageLength: 10,
        initiated_page: page,
        initiated_pageLength: 10,
        completed_page: page,
        completed_pageLength: 10,
        missed_page: page,
        missed_pageLength: 10,
      },
    };

    let url = `${this.apiUrl}vaccinator/visits`;

    return this._http.post<any>(url, reqData);
  }
  getVaccinatorVisitsPrevieus(
    searchText: string,
    page: number,
    selectedDate = null
  ) {

    selectedDate = selectedDate == null ? new Date() : selectedDate;
    this.vaccinator = this.authManageService.getLoggedInUser();
    if (!localStorage.getItem('selectedSiteId')) {
      this.selectedSiteId = this.vaccinator.site_ids[0];
    } else {
      this.selectedSiteId = localStorage.getItem('selectedSiteId');
    }
    //this.selectedSiteId = this.authManageService.getLoggedInUser().sites[0].site_id;
    let reqData = {
      siteId: this.selectedSiteId,//this.vaccinator.site_ids[0],
      startDate: moment(selectedDate).format('YYYY-MM-DD'),
      endDate: moment(selectedDate).format('YYYY-MM-DD'),
      q: searchText ? searchText.toString().trim() : '',
      // as per ML, it is not required
      //currentTime: currentTime,
      paginationOptions: {
        checkedIn_page: page,
        checkedIn_pageLength: 10,
        upcoming_page: page,
        upcoming_pageLength: 10,
        observation_page: page,
        observation_pageLength: 10,
        initiated_page: page,
        initiated_pageLength: 10,
        completed_page: page,
        completed_pageLength: 10,
        missed_page: page,
        missed_pageLength: 10,
      },
    };

    let url = `${this.apiUrl}vaccinator/visits`;

    return this._http.post<any>(url, reqData);
  }
  getchecklist(visitId: string): Observable<any[]> {
    this.vaccinator = this.authManageService.getLoggedInUser();
    const url = `${this.apiUrl}visit/checklist/get`;
    const checkListReq = { visitId: visitId };

    return this._http
      .post<any>(url, checkListReq)
      .pipe(map((res) => res.checklist));
  }

  saveAnswerList(reqData): Observable<any> {
    this.vaccinator = this.authManageService.getLoggedInUser();

    const url = `${this.apiUrl}visit/checklist/save`;
    return this._http.post<any>(url, reqData);
  }

  checkInVisitStatus(reqData: any) {
    let url = `${this.apiUrl}visit/status/checkIn`;
    return this._http.post<any>(url, reqData);
  }

  compelte() {
    this.vaccinator = this.authManageService.getLoggedInUser();

    const url = `${this.apiUrl}visit/status/complete`;
    let vaccinatorVisit = JSON.parse(localStorage.getItem('vaccinator-visit'));
    const completeReq = { id: vaccinatorVisit.id };
    return this._http.post<any>(url, completeReq);
  }

  getSiteInfo(siteId: string): Observable<any> {
    const siteInfoReq = { id: siteId };

    const url = `${this.apiUrl}site/get`;
    return this._http.post<any>(url, siteInfoReq);
  }

  Observation(id: string) {
    const url = `${this.apiUrl}visit/status/observation`;
    const observationReq = { id: id };
    return this._http.post<any>(url, observationReq);
  }

  visitUpdateAdminstrationDetails(reqData: any = {}) {
    this.vaccinator = this.authManageService.getLoggedInUser();

    reqData['vaccinator'] = this.vaccinator.user_id;
    const url = `${this.apiUrl}visit/updateAdminstrationDetails`;
    return this._http.post<any>(url, reqData);
  }

  reportAdverseEvent(advserseEventReq: any) {
    const url = `${this.apiUrl}vaccinator/visit/reportAdverseEvent`;
    return this._http.post<any>(url, advserseEventReq);
  }

  allocateBatch(reqData: any = {}) {
    const url = `${this.apiUrl}visit/allocateMaterial`;
    return this._http.post<any>(url, reqData);
  }

  getMaterialList(reqObj: any = {}): Observable<any> {
    if (!localStorage.getItem('selectedSiteId')) {
      this.selectedSiteId = this.vaccinator.site_ids[0];
    } else {
      this.selectedSiteId = localStorage.getItem('selectedSiteId');
    }

    this.vaccinator = this.authManageService.getLoggedInUser();
    reqObj['site_id'] = this.selectedSiteId;//this.vaccinator.site_ids[0];
    const url = `${this.apiUrl}materialBatch/activeBatchNumbers`;
    return this._http.post<any>(url, reqObj);
  }

  //

  reportingDailySiteVaccinationReport(reqData: any = {}) {
    this.vaccinator = this.authManageService.getLoggedInUser();
    reqData['site_id'] = this.vaccinator.site_ids[0];

    const url = `${this.apiUrl}reporting/dailySiteVaccinationReport`;
    return this._http.post<any>(url, reqData);
  }

  getAdverseEnvent(visit: string, recipient_id?: string) {
    this.vaccinator = this.authManageService.getLoggedInUser();
    let reqPayload = {
      visit_id: visit,
      recipient_id,
    };
    const url = `${this.apiUrl}recipient/visit/adverseEvent`;
    return this._http.post<any>(url, reqPayload);
  }

  saveAdverseEnvent(reqPayload) {
    this.vaccinator = this.authManageService.getLoggedInUser();
    const url = `${this.apiUrl}recipient/visit/adverseEvent/save`;
    return this._http.post<any>(url, reqPayload);
  }
}
