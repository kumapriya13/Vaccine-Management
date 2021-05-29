import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ILoginResContext } from '../../../shared/auth/models/loginResContext';
import { AdminTypes, ROUTE } from '../../constants';
import { IAuthAdmin } from '../../domain';
import { AuthManageService } from './auth-manage.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private apiUrl = environment.apiUrl;
  public currentAdminSubject: BehaviorSubject<IAuthAdmin>;
  public currentAdmin: Observable<IAuthAdmin>;
  httpHeaders = new HttpHeaders();

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private authManageService: AuthManageService
  ) {
    this.currentAdminSubject = new BehaviorSubject<IAuthAdmin>(
      JSON.parse(localStorage.getItem('currentAdmin'))
    );
    this.currentAdmin = this.currentAdminSubject.asObservable();
  }

  public get currentAdminValue(): IAuthAdmin {
    return this.currentAdminSubject.value;
  }

  public getAdminType(): AdminTypes {
    const user_type = this.authManageService.getLoggedInUser()?.user_type;

    return user_type;
  }

  public getProvider(): any {
    return this.authManageService.getLoggedInUser()['provider'];
  }

  public isProviderAdmin(): boolean {
    return this.isAdminTypeOf(AdminTypes.providerAdmin);
  }

  public isAdminTypeOf(adminType: AdminTypes): boolean {
    return this.getAdminType() === adminType;
  }

  adminSignIn(reqData: any): Observable<any> {
    let url = this.apiUrl + 'admin/login';
    return this._http.post<any>(url, reqData).pipe(
      map((res) => {
        // status: "newPasswordRequired"
        localStorage.removeItem('mfaFlag');

        if (res.hasOwnProperty('challengeType')) {
          localStorage.setItem('_authUserVaccinatorAdmin', reqData.user);
          this._router.navigate(['/auth/admin-verify-otp-mfa']); //dkp
        }

        if (res['status'] && res['status'] == 'newPasswordRequired') {
          localStorage.setItem('new-set-password-user', reqData.user);
          this._router.navigate(['/auth/admin-set-new-password']);
          return res;
        }

        localStorage.setItem('loggedinUser', JSON.stringify(res));
        let jwtDecodedToken = jwt_decode(res.jwt);
        let customUserType = jwtDecodedToken['custom:user_type'];

        let tokenKey = '';
        let redirectNavigationLink = '';
        /** Improvement on the block to hande user types */
        switch (customUserType) {
          case AdminTypes.superAdmin:
            tokenKey = 'super_admin-token';
            redirectNavigationLink = ROUTE[AdminTypes.superAdmin];
            break;
          case AdminTypes.siteAdmin:
            tokenKey = 'site_admin-token';
            redirectNavigationLink = ROUTE[AdminTypes.siteAdmin];
            break;
          case AdminTypes.facilityAdmin:
            tokenKey = 'facility_admin-token';
            redirectNavigationLink = ROUTE[AdminTypes.facilityAdmin];
            break;
          case AdminTypes.receptionist:
            tokenKey = 'receptionist_admin-token';
            redirectNavigationLink = ROUTE[AdminTypes.receptionist];
            break;
          case AdminTypes.providerAdmin:
            tokenKey = 'provider_admin';
            redirectNavigationLink = ROUTE[AdminTypes.providerAdmin];
            break;
          default:
            tokenKey = 'vaccinator-token';
            redirectNavigationLink = ROUTE[AdminTypes.vaccinator];
            break;
        }

        this.currentAdminSubject.next(res);
        if (tokenKey && redirectNavigationLink) {
          localStorage.setItem('current-auth-logged-key', tokenKey);
          localStorage.setItem(tokenKey, JSON.stringify(res));
          this.authManageService.saveAuth(res);
          this._router.navigate([redirectNavigationLink]);
        }
        return res;
      })
    );
  }
  resetPassword(user: any): Observable<any> {
    const resetPasswordReq: object = user ;
    const url = `${this.apiUrl}admin/resetPassword`;
    return this._http.post<any>(url, resetPasswordReq);
  }

  newPassword(reqData: any): Observable<any> {
    const url = `${this.apiUrl}admin/confirmNewPassword`;
    return this._http.post<any>(url, reqData);
  }

  adminSignOut(redirectToHome: boolean = true) {
    this.authManageService.logout(redirectToHome);
  }

  adminConfirmNewAdmin(changePasswordReq: any) {
    const currentUser = JSON.parse(
      localStorage.getItem('loggedinUser')
    ) as ILoginResContext;

    let jwt = currentUser ? currentUser.jwt : '';

    const header = this.httpHeaders.set('Authorization', 'Bearer ' + jwt);
    const url = `${this.apiUrl}admin/confirmNewAdmin`;
    return this._http.post<any>(url, changePasswordReq);
  }

  verifyCodeMfa(reqData: any): Observable<any> {
    let url = this.apiUrl + 'admin/respondToAuthChallenge';
    return this._http.post<any>(url, reqData);
  }

  resendCode(reqData: any): Observable<any> {
    const url = `${this.apiUrl}login/recipient/resendCode`;
    return this._http.post<any>(url, reqData);
  }

  getMfaFlagForVaccinatorSiteAdmin(): Observable<any> {
    //dkp
    let access_token = JSON.parse(localStorage.getItem('loggedinUser'))
      .access_token;
    let url = `${this.apiUrl}admin/getMFAPreference`;
    return this._http.post<any>(url, { accessToken: access_token });
  }

  saveMfaFlagForVaccinatorSiteAdmin(flag: boolean): Observable<any> {
    //dkp
    let access_token = JSON.parse(localStorage.getItem('loggedinUser'))
      .access_token;
    let url = `${this.apiUrl}admin/setMFAPreference`;
    return this._http.post<any>(url, {
      mfaEnabled: flag,
      accessToken: access_token,
    });
  }

  getUserByIdForVaccinatorSiteAdmin(id: string = null) {
    let url = `${this.apiUrl}recipient/profile`;

    return this._http.post<any>(url, {});
  }

  saveVaccinatorProfile(reqData: any = {}) {
    let url = `${this.apiUrl}vaccinator/userDetails`;
    return this._http.post<any>(url, reqData);
  }

  fetchdetails(reqData: any): Observable<any> {
    console.log('---' + reqData);
    let url = this.apiUrl + 'reference/zip';
    return this._http.post<any>(url, reqData);
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

  getUserDetails(): Observable<any> {
    const url = `${this.apiUrl}admin/userDetails`;
    return this._http.post<any>(url, {});
  }
}
