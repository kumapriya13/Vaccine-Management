import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthManageService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private authManageService: AuthManageService
  ) {}

  getSiteBySearch(reqObj: any): Observable<any> {
    let currentRecipient = this.authManageService.getLoggedInUser();
    reqObj.recipient_id = currentRecipient?.recipient_id || '';

    let url = this.apiUrl + 'site/search';
    return this._http.post<any>(url, reqObj);
  }

  getPlaceGeoLoc(inputStaring: string): Observable<any> {
    let reqObj = {
      zip_code: inputStaring,
    };
    let url = this.apiUrl + 'geoLocation/findLocation';
    return this._http.post<any>(url, reqObj);
    // return this._http.get<any>("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+inputStaring+"&inputtype=textquery&fields=formatted_address,geometry&key=AIzaSyB6S4RnWmMiiwbNO97gNWu3Q7kE2RBcHP0");
  }

  getSlotBySearch(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'slot/search';
    reqObj.site_ids = this.authManageService.getLoggedInUser()?.site_ids;
    reqObj.site_ids;
    return this._http.post<any>(url, reqObj);
  }
  checkSlotDate(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/available';
    return this._http.post<any>(url, reqObj);
  }

  slotAvailableValues(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'slot/availableValues';
    return this._http.post<any>(url, reqObj);
  }

  siteScheduleVisit(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/scheduleVisit';
    return this._http.post<any>(url, reqObj);
  }

  siteScheduleVisitByDateTime(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/scheduleVisitByDateTime';
    return this._http.post<any>(url, reqObj);
  }

  scheduleFamilyMembersSlots(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/scheduleFamilyMembersSlots';
    return this._http.post<any>(url, reqObj);
  }

  siteCancelVisit(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/cancelVisit';
    return this._http.post<any>(url, reqObj);
  }
}
