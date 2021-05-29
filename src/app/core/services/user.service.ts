import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RecipientAuthService } from './auth/recipient-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private recipient_id: string = null;
  private apiUrl = environment.apiUrl;
  public _userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private _http: HttpClient,
    private _providerRecipientAuthService: RecipientAuthService, private _cookieService: CookieService
  ) {
    this._providerRecipientAuthService.currentRecipient.subscribe((currentRecipient: any) => {
      this.recipient_id = currentRecipient ? currentRecipient.recipient_id : null;
    });
  }

  getUserById(recipient_id?: string) {
    let url = `${this.apiUrl}recipient/profile`;
    return this._http.post<any>(url, { recipient_id });
  }

  getClassiCode(){
    let url = `${this.apiUrl}reference/classificationCodes`;
    return this._http.post<any>(url, {});
  }

  saveRecipientProfile(reqData: any = {}) {
    let url = `${this.apiUrl}recipient/profile/save`;
    return this._http.post<any>(url, reqData);
  }

  getPublicRecipientProfile(reqData: any = {}) {
    let url = `${this.apiUrl}recipient/profile/public`;
    return this._http.post<any>(url, reqData);
  }

  getRecipientVisits() {
    let recipientId = JSON.parse(localStorage.getItem('currentRecipient')).recipient_id;


    let url = `${this.apiUrl}recipient/visits`;
    return this._http.post<any>(url, { id: recipientId }).pipe(map(pipeRes => {
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

      // if(pipeRes.results.length>0){
      // }
      // no_of_doses_in_series

      return pipeRes;
    }));;
  }

  setRecipientVisitsTolocalStorage(recipientVisits: any) {
    localStorage.setItem('recipient-visit', JSON.stringify(recipientVisits));
  }

  getRecipientVisitsTolocalStorage() {
    return JSON.parse(localStorage.getItem('recipient-visit'));
  }

  getRecipientVisitsTolocalStorageInAscendingByCreatedTime() {
    let recipientVisits = this.getRecipientVisitsTolocalStorage();
    // recipientVisits['results'].sort(function (obj1: any, obj2: any) {
    //   // console.log("asc" , (new Date(obj1.create_time).getUTCMilliseconds()) - (new Date(obj2.create_time).getUTCMilliseconds()));
    //   return (new Date(obj2.create_time).getUTCMilliseconds()) - (new Date(obj1.create_time).getUTCMilliseconds());
    // });
    return recipientVisits;
  }

  getRecipientVisitsTolocalStorageInDescendingByCreatedTime() {
    let recipientVisits = this.getRecipientVisitsTolocalStorage();
    // recipientVisits['results'].sort(function (obj1: any, obj2: any) {
    //   // console.log("desc" , (new Date(obj2.create_time).getUTCMilliseconds()) - (new Date(obj1.create_time).getUTCMilliseconds()));
    //   return (new Date(obj1.create_time).getUTCMilliseconds()) - (new Date(obj2.create_time).getUTCMilliseconds());
    // });
    return recipientVisits;
  }

  checkInVisitStatus(reqData: any) {
    let url = `${this.apiUrl}visit/status/checkIn`;
    return this._http.post<any>(url, reqData);
  }

  saveVisitChecklist(reqData: any) {
    let url = `${this.apiUrl}visit/checklist/save`;
    return this._http.post<any>(url, reqData);
  }


  getMfaFlag(): Observable<any> { //dkp
    let access_token = JSON.parse(localStorage.getItem('currentRecipient')).access_token;
    let url = `${this.apiUrl}login/recipient/getMFAPreference`;
    return this._http.post<any>(url, { accessToken: access_token });
    //returns object
  }

  saveMfaFlag(flag: boolean): Observable<any> { //dkp
    let access_token = JSON.parse(localStorage.getItem('currentRecipient')).access_token;
    let url = `${this.apiUrl}login/recipient/setMFAPreference`;
    return this._http.post<any>(url, { mfaEnabled: flag, accessToken: access_token });
    //returns {}
  }

  recipientQRCode(reqData: any = {}) {
    let url = `${this.apiUrl}recipient/QRCode`;
    return this._http.post<any>(url, reqData);
  }

  getMaterialBatch(batch_material_id: string): Observable<any> {
    const url = `${this.apiUrl}materialBatch/get`;
    return this._http.post<any>(url, {id: batch_material_id});
  }
}
