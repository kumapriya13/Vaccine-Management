import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RecipientAuthService, UserService } from 'src/app/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';
import { environment } from '../../../../environments/environment';

import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-sign-in',
  templateUrl: './page-sign-in.component.html',
  styleUrls: ['./page-sign-in.component.scss'],
})
export class PageSignInComponent implements OnInit {
  dialCode: string = '+1';
  passwordToggler: boolean;
  returnUrl: string;
  authSignInForm: FormGroup;
  userType: string = 'recipient';
  hide: boolean = true;
  isMfaEnabled: boolean = true;

  @ViewChild('phoneInput') phoneInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  phoneEmailInputToggler = true;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private _NotificationService: NotificationService,
    private _cookieService: CookieService,
    private _userService: UserService,
    private _toolTipService :TooltipService
  ) {}

  ngOnInit(): void {
    let toolTipData = localStorage.getItem('toolTipData'); 
    if(!toolTipData){
          this._toolTipService.getToolTipText().subscribe(
          (resp)=>{
            localStorage.setItem('toolTipData',JSON.stringify(resp));
          },
          (err)=>{
            console.log('Error in tooltip api calling '+err);
          }
        )	  
    }
    this.buildForm();
    this.passwordToggler = true;
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  buildForm() {
    this.authSignInForm = this._formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onCountryChange(event) {
    this.dialCode = '+' + event.dialCode;
  }

  checkForUserPrimaryTypeFun() {
    this.phoneEmailInputToggler = !isNaN(this.user.value);
    if (this.phoneEmailInputToggler) {
      setTimeout(() => {
        this.phoneInput.nativeElement.focus();
      }, 0);
    } else {
      setTimeout(() => {
        this.emailInput.nativeElement.focus();
      }, 0);
    }
  }

  //Getting Ref of Form Member
  get user() {
    return this.authSignInForm.get('user');
  }
  get password() {
    return this.authSignInForm.get('password');
  }

  logo = environment.logoImg;
  authSignInFormSub() {
    if (!this.authSignInForm.valid) {
      return this._NotificationService.showNotification(
        'please enter the Mobile Phone Number and password',
        'top',
        'error'
      );
    }
    let authSigninReqData = this.authSignInForm.value;
    let reqData = {
      user: this.phoneEmailInputToggler
        ? this.dialCode + authSigninReqData.user
        : authSigninReqData.user,
      password: authSigninReqData.password,
    };

    localStorage.removeItem('mfaFlag');
    this._providerRecipientAuthService.signIn(reqData).subscribe(
      (res) => {
        if (res.hasOwnProperty('challengeType')) {
          localStorage.setItem('_authUser', reqData.user);
          this._router.navigate(['/auth/verify-otp-mfa']); //dkp
        } else {
          this._router.navigate(['/recipient/dashboard']);
        }
        //this.authSignInForm.reset('');
        // if (!res.err) {
        //   // let token = {
        //   //  // jwt_token: res.jwt,
        //   //   userType: this.userType
        //   // };
        //   // this._cookieService.set('jwt','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJ1bmtub3duIn0sImlhdCI6MTYxMTQxMDAzMn0.1PRcc3Dgf6OOdHXmdwN3HIRJOPDeihvfpxGnZdIYjIk')
        //   //this._cookieService.set('jwt', token.jwt_token)
        //   // localStorage.setItem('vms-token', JSON.stringify(res));
        //   // this._router.navigate(['/recipient/dashboard']);
        // }
        // if (!!res.err) {
        //   const err = res.err;
        //   if (err.code === 'UserNotConfirmedException') {
        //     return alert(err.message);
        //   }
        //   if (err.code === 'NotAuthorizedException') {
        //     return alert(err.message);
        //   }
        // }
      },
      (err) => {
        if (
          err.error.hasOwnProperty('message') &&
          err.error.message == 'User is not confirmed.'
        ) {
          this.sendOtpAndNav(reqData.user);
        } else {
          return this._NotificationService.showNotification(
            'Incorrect username and password',
            'top',
            'error'
          );
        }
      }
    );
  }

  sendOtpAndNav(userId) {
    let user = {
      user: userId,
    };
    this._providerRecipientAuthService.resendCode(user).subscribe(
      (res) => {
        this._NotificationService.showNotification(
          'Verification Code sent on your registered Mobile Phone Number',
          'top',
          'success'
        );
        setTimeout(()=>{
          this._router.navigate(['/auth/verify-otp']);
        },1000);

      },
      (err) => {
        this._NotificationService.showNotification(
          'Please check your registered Mobile Phone Number',
          'top',
          'error'
        );
      }
    );
  }

  getUserType(userType: string) {
    this.userType = userType;
  }

  getMfaFlag() {
    this._userService.getMfaFlag().subscribe(
      (res) => {
        this.isMfaEnabled = res.mfaEnabled;
        if (this.isMfaEnabled) this._router.navigate(['/auth/verify-otp-mfa']);
        //dkp
        else this._router.navigate(['/recipient/dashboard']);
      },
      (err) => {
        console.log('Error : ' + err);
        // return this._NotificationService.showNotification("Incorrect username and password", "top", 'error');
      }
    );
  }
}
