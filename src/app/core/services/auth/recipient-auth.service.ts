import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ILoginResContext } from 'src/app/shared/auth/models/loginResContext';

import { environment } from '../../../../environments/environment';
import { IAuthRecipient } from '../../domain';
import { AuthManageService } from './auth-manage.service';

@Injectable({ providedIn: 'root' })
export class RecipientAuthService {
  private apiUrl = environment.apiUrl;
  private ssoUrL = environment.sso_url;
  private currentRecipientSubject: BehaviorSubject<IAuthRecipient>;
  public currentRecipient: Observable<IAuthRecipient>;

  constructor(private _http: HttpClient, private _router: Router, private authManageService: AuthManageService) {
    this.currentRecipientSubject = new BehaviorSubject<IAuthRecipient>(
      JSON.parse(localStorage.getItem('currentRecipient'))
    );
    this.currentRecipient = this.currentRecipientSubject.asObservable();
  }

  public get currentRecipientValue(): IAuthRecipient {
    return this.currentRecipientSubject.value;
  }

  public navToDashboradIfAuthenticated() {
    if (
      this.currentRecipientValue != null &&
      'jwt' in this.currentRecipientValue &&
      this.currentRecipientValue.jwt != ''
    ) {
      this._router.navigate(['/recipient']);
    }
  }

  recipientCreateNewLogin(formData): Observable<any> {
    let reqCreateNewLoginData = {
      name: formData['firstName'] + ' ' + formData['lastName'],
      email: formData['email'],
      mobile_number: formData['phone'],
      password: formData['password'],
    };

    let reqRecipientCreateData = {
      fname: formData['firstName'],
      lname: formData['lastName'],
      home_adress: formData['address'],
      zip: formData['zip'],
      dob: moment(formData.dob).format('YYYY-MM-DD'),
      gender: 1,
      mobile_number: '' + formData['phone'],
      email: formData['email'],
      recipient_poi_id: 1,
      health_worker_category_id: 1,
      county_id: 3396,
      state_id: 8,
      country_id: 1,
    };
    let url = `${this.apiUrl}user/create-new-login`;
    return this._http.post<any>(url, reqCreateNewLoginData).pipe(
      mergeMap((res) => {
        localStorage.setItem('Username', res.UserName);
        return this.recipientCreate(reqRecipientCreateData);
      })
    );
  }

  recipientCreate(reqData: any): Observable<any> {
    let url = `${this.apiUrl}recipient/create`;
    return this._http.post<any>(url, reqData).pipe(
      map((x) => {
        return x.Response;
      })
    );
  }

  signIn(reqData: any): Observable<any> {
    let url = this.apiUrl + 'login';
    console.log(url);
    return this._http
      .post<any>(url, reqData, { withCredentials: true })
      .pipe(
        map((res) => {
          console.log(res.status);
          if (res['status'] && res['status'] == 'newPasswordRequired') {
            localStorage.setItem('new-set-password-user', reqData.user);
            this._router.navigate(['/auth/recipient-set-new-password']);
            throw new Error(reqData.user);
          }

          this.authManageService.saveAuth(res);

          localStorage.setItem('currentRecipient', JSON.stringify(res));
          this.currentRecipientSubject.next(res);
          return res;
        }),
        catchError((err) => {
          if (
            err.error.hasOwnProperty('message') &&
            err.error.message == 'User is not confirmed.'
          ) {
            this.currentRecipientSubject.next(reqData);
          }
          return throwError(err);
        })
      );
  }

  confirmNewRecipient(changePasswordReq: any) {
    const currentUser = JSON.parse(
      localStorage.getItem('loggedinUser')
    ) as ILoginResContext;


    const url = `${this.apiUrl}manage/recipient/confirmNewRecipient`;
    return this._http.post<any>(url, changePasswordReq);
  }

  fetchdetails(reqData: any): Observable<any> {
    let url = this.apiUrl + 'reference/zip';
    return this._http.post<any>(url, reqData);
  }

  recipientSignUp(reqData: any): Observable<any> {
    let url = this.apiUrl + 'login/recipient/register';
    return this._http.post<any>(url, reqData).pipe(
      map((res) => {
        localStorage.setItem('currentRecipient', JSON.stringify(reqData));
        this.currentRecipientSubject.next(reqData);
        return res;
      })
    );
  }

  recipientCheckDuplicate(fname: string, lname: string, dob: string, email: string, phone): Observable<any> {
    let query = `fname=${fname} AND lname=${lname} AND dob=${dob}`;

    let url = this.apiUrl + 'manage/recipient/usersearch';
    return this._http.post<any>(url, {
      q: query,
      page: 1,
      pageLength: 1,
    }).pipe(map(({results}) => {
      return results.length > 0 ? results[0] : null;
    }));
  }

  recipientInvite(recipient: any, userType?: 'email' | 'phone'): Observable<any> {
    const resendInvite = recipient.inviteStatus === 'sent';
    if (resendInvite) {
      userType = recipient.userType;
    }
    let obj=  {
      recipient_id: recipient.id,
      resendInvite,
      userType,
      email: recipient.email,
      mobile_number: recipient.mobile_number
    }
    let url = this.apiUrl + 'manage/recipient/userinvite';
    return this._http.post<any>(url, obj);
  }

  recipientUserCheck(reqData: any): Observable<any> {

    let url = this.apiUrl + 'login/recipient/checkUserAvailable';
    return this._http.post<any>(url, reqData)
  }
  recipientVerifyCode(reqData: any): Observable<any> {
    let url = this.apiUrl + 'login/recipient/verifyCode';
    //let url = this.apiUrl + "login/recipient/respondToAuthChallenge";
    return this._http.post<any>(url, reqData);
  }

  recipientVerifyCodeMfa(reqData: any): Observable<any> {
    //let url = this.apiUrl + "login/recipient/verifyCode";
    let url = this.apiUrl + 'login/recipient/respondToAuthChallenge';
    return this._http.post<any>(url, reqData);
  }

  recipientSignOut(redirectToHome: boolean = true) {
    this.authManageService.logout(redirectToHome);
    this.currentRecipientSubject.next(null);
  }

  recipientUserDetails(id_token: string): Observable<any> {
    const url = `${this.apiUrl}user/info`;
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `${id_token}`,
    });
    const options = {
      headers: httpHeaders,
    };
    return this._http.get<any>(url, options).pipe(
      map((x) => {
        return x.Response;
      })
    );
  }

  ssoLogin(): Observable<any> {
    const url = `${this.ssoUrL}client_id=${environment.client_id}&response_type=token&redirect_uri=http://localhost:4200/home`;
    return this._http.get<any>(url);
  }

  userCheck(emailId: string): Observable<boolean> {
    const userCheckReqBody = { email: emailId };
    const url = `${this.apiUrl}user/check`;
    return this._http.post<any>(url, userCheckReqBody).pipe(
      map((x) => {
        return x.Response.ExistingRecipient;
      })
    );
  }

  resetPassword(phoneNumber: string): Observable<any> {
    const resetPasswordReq: object = { user: phoneNumber };
    const url = `${this.apiUrl}login/recipient/resetPassword`;
    return this._http.post<any>(url, resetPasswordReq);
  }

  changePassword(reqData: any): Observable<any> {
    const url = `${this.apiUrl}login/recipient/changePassword`;
    return this._http.post<any>(url, reqData);
  }

  newPassword(reqData: any): Observable<any> {
    const url = `${this.apiUrl}login/recipient/confirmNewPassword`;
    return this._http.post<any>(url, reqData);
  }

  resendCode(reqData: any): Observable<any> {
    const url = `${this.apiUrl}login/recipient/resendCode`;
    return this._http.post<any>(url, reqData);
  }
  getDynamicQuestions(reqData: any): Observable<any> {
    const url = `${this.apiUrl}QuestionnaireDynamic/search`;
    return this._http.post<any>(url, reqData);
  }

  allStateOnUs(reqData: any): Observable<any> {
    const url = `${this.apiUrl}reference/location`;
    return this._http.post<any>(url, reqData);
  }

  allCountyState(reqDatas: any): Observable<any> {
    const url = `${this.apiUrl}reference/location`;
    return this._http.post<any>(url, reqDatas);
  }


  checkUserAvailable(user: string): Observable<boolean> {
    const userCheckReqBody = { user: user };
    const url = `${this.apiUrl}admin/checkUserAvailable`;
    return this._http.post<any>(url, userCheckReqBody);
  }
}
