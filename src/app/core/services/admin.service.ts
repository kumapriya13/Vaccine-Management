import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  admin: any = {};
  private currentAuthLoggedKey;
  private apiUrl = environment.apiUrl;
  public _userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // public userProfile: Observable<any> = this._userProfile.asObservable();

  constructor(private http: HttpClient, private _router: Router) {
    this.admin = JSON.parse(localStorage.getItem('admin-token'));
  }

  getAdminInfo() {
    this.currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key');
    this.admin = JSON.parse(localStorage.getItem(this.currentAuthLoggedKey));
    console.log(this.admin);
    let url = `${this.apiUrl}admin/userDetails`;
    let reqData = { id: this.admin.user_id };

    return this.http
      .post<any>(url, reqData)
      .pipe(
        map((response) => {
          this._userProfile.next(response);
          localStorage.setItem(this.currentAuthLoggedKey + "-user", JSON.stringify(response));
          return response;
        })
      );
  }

  userCheck(emailId: string): Observable<boolean> {
    const userCheckReqBody = { email: emailId };
    const url = `${this.apiUrl}user/check`;
    return this.http.post<any>(url, userCheckReqBody).pipe(
      map((x) => {
        return x.Response.ExistingRecipient;
      })
    );
  }

  fetchZipDetails(reqData: any): Observable<any> {
    console.log('---' + reqData);
    let url = this.apiUrl + 'reference/zip';
    return this.http.post<any>(url, reqData);
  }

  saveAdminProfile(reqData: any = {}) {
    this.currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key');

    let url = `${this.apiUrl}vaccinator/save`;
    return this.http.post<any>(url, reqData);
  }

  changePassword(changePasswordReq: any) {
    this.currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key');

    const url = `${this.apiUrl}admin/changePassword`;
    return this.http.post<any>(url, changePasswordReq);
  }

  getRecipientVisits(recipient_id: string): Observable<any[]> {
    const url = `${this.apiUrl}recipient/visits`;
    return this.http.post<any>(url, {recipient_id}).pipe(map(result => result.results));
  }

  getRecipientVisits2(recipient_id: string): Observable<any[]> {
    const url = `${this.apiUrl}recipient/visits`;
    return this.http.post<any>(url, {recipient_id});
  }

  

  cancelRecipientVisit(reqObj: any): Observable<any> {
    let url = this.apiUrl + 'site/adminCancelVisit';
    return this.http.post<any>(url, reqObj);
  }
}
