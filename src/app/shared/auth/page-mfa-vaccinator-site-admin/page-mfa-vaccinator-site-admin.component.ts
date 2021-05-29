import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { map } from 'rxjs/operators';
import { AuthManageService, SiteAdminService } from 'src/app/core';

import { AdminAuthService } from '../../../core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-mfa-vaccinator-site-admin',
  templateUrl: './page-mfa-vaccinator-site-admin.component.html',
  styleUrls: ['./page-mfa-vaccinator-site-admin.component.scss']
})
export class PageMfaVaccinatorSiteAdminComponent implements OnInit {

  authVerifyForm: FormGroup;
  email: string;
  user: string;
  @ViewChild('secondDigit') secondDigit: ElementRef;
  @ViewChild('thirdDigit') thirdDigit: ElementRef;
  @ViewChild('fourthDigit') fourthDigit: ElementRef;
  @ViewChild('fifthDigit') fifthDigit: ElementRef;
  @ViewChild('sixDigit') sixDigit: ElementRef;
  mobile_number: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AdminAuthService,
    private _notificationService: NotificationService,
    private _siteAdminService: SiteAdminService,
    private authManageService:AuthManageService

  ) { }

  ngOnInit(): void {
    this.buildPageVerifyForm();
 }

  buildPageVerifyForm() {
    this.authVerifyForm = this._formBuilder.group({
      firstDigit: ['', [Validators.required]],
      secondDigit: ['', [Validators.required]],
      thirdDigit: ['', [Validators.required]],
      fourthDigit: ['', [Validators.required]],
      fifthDigit: ['', [Validators.required]],
      sixDigit: ['', [Validators.required]],
    });
  }

  pageVerifysub() {
    if (!this.authVerifyForm.valid) {
      return this._notificationService.showNotification("Please enter the code","top",'error')
    }
    const confirmationCode = Object.values(this.authVerifyForm.value).join('');

    let session_token = JSON.parse(localStorage.getItem('loggedinUser')).session;
    if(this.user=='' || this.user == null)
       this.user = localStorage.getItem('_authUserVaccinatorAdmin') ;

    const reqData = {
      user: this.user,
      code: confirmationCode.toString(),
      session: session_token
    };
    console.log("Request data pageVerifysub : "+reqData);
    this._authService.verifyCodeMfa(reqData).subscribe(
      res => {
       if (res['status'] && res['status'] == 'newPasswordRequired') {
          this._router.navigate(['/auth/admin-change-password']);
          return res;
        }

        let jwtDecodedToken = jwt_decode(res.jwt);
        let customUserType = jwtDecodedToken['custom:user_type'];
       
        let object ={};let site_ids=[]; //
        object = res;
        let tokenKey = '';
        let redirectNavigationLink = '';

        console.log('customUserType : '+customUserType); 
        if (customUserType == 'super_admin') {
          tokenKey = 'super_admin-token';
          redirectNavigationLink = '/super-admin';
        } else if (customUserType == 'site_admin') {
          tokenKey = 'site_admin-token';
          redirectNavigationLink = '/site-admin/dashboard';
        } else if (customUserType == 'facility_admin') {
          tokenKey = 'facility_admin-token';
          redirectNavigationLink = '/facility-admin/dashboard';
        } else if (customUserType == 'vaccinator'){
          tokenKey = 'vaccinator-token';
          localStorage.setItem('vaccinator-token', JSON.stringify(object));
          redirectNavigationLink = '/vaccinator/dashboard';
        } else if(customUserType == 'provider_admin'){
              tokenKey = 'provider_admin';
              redirectNavigationLink = '/provider';
        }else if(customUserType == 'receptionist'){
          tokenKey = 'receptionist_admin-token';
          redirectNavigationLink = '/receptionist';
        }          
        else{
             console.log('In Valid customUserType');
             return this._notificationService.showNotification("Invalid User Type");
        }
          site_ids.push(jwtDecodedToken['custom:site_ids']);
          object['user_id']   =  jwtDecodedToken['custom:user_id'];
          object['user_name']   =  jwtDecodedToken['cognito:username'];
          object['user_type'] = jwtDecodedToken['custom:user_type'];
          object['site_ids'] = site_ids;
          object['recipient_id']   =  jwtDecodedToken['custom:user_id'];

        this.authManageService.saveAuth(res);
        localStorage.setItem('loggedinUser', JSON.stringify(object));
        localStorage.setItem('currentAdmin', JSON.stringify(object));
        localStorage.setItem('currentRecipient', JSON.stringify(object));
        localStorage.setItem('current-auth-logged-key', tokenKey);

        this.getUserDetails().subscribe(() => {
          this._authService.currentAdminSubject.next(res);
          if (tokenKey && redirectNavigationLink) {       
            localStorage.setItem(tokenKey, JSON.stringify(object));
            console.log('redirectNavigationLink : '+redirectNavigationLink );
            this._router.navigate([redirectNavigationLink]);
          }
        });

      }, (err) => {
        // return alert('something went wrong')
        return this._notificationService.showNotification("Please enter valid OTP","top",'error');
      }
    );
  }
  onKey(value: string) {
    //console.log(this.authVerifyForm.get('fourthDigit').focus());
    if (value == 'secondDigit') {
      this.secondDigit.nativeElement.focus();
    }
    else if (value == 'thirdDigit') {
      this.thirdDigit.nativeElement.focus();
    }
    else if (value == 'fourthDigit') {
      this.fourthDigit.nativeElement.focus();
    }
    else if (value == 'fifthDigit') {
      this.fifthDigit.nativeElement.focus();
    }
    else if (value == 'fifthDigit') {
      this.fifthDigit.nativeElement.focus();
    }
    else if (value == 'sixDigit') {
      this.sixDigit.nativeElement.focus();
    }
  }


  getUserDetails() {
    return this._authService.getUserDetails().pipe(map(
      response => {
        console.log(response);
        let loggedInUser = this.authManageService.getLoggedInUser();
        loggedInUser = Object.assign({}, loggedInUser, response)
        this.authManageService.setLoggedInUser(loggedInUser);
       }, (err) => {
        console.log("Error...")
      }));
  }
}
