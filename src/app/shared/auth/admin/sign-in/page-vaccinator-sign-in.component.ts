import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TooltipService } from 'src/app/core/services/tooltip.service';
import { environment } from 'src/environments/environment';

import { AdminAuthService } from '../../../../core';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-page-vaccinator-sign-in',
  templateUrl: './page-vaccinator-sign-in.component.html',
  styleUrls: ['./page-vaccinator-sign-in.component.scss'],
})
export class adminSignInComponent implements OnInit {
  authSignInForm: FormGroup;
  passwordToggler: boolean;
  userType: string = 'vaccinator';
  hide: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerAdminAuthService: AdminAuthService,
    private _cookieService: CookieService,
    private notify: NotificationService,
    private _location: Location,
    private _toolTipService:TooltipService
  ) {}

  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {

    let toolTipData = localStorage.getItem('toolTipData'); 
    if(!toolTipData){
        console.log("Provider page signin init to load tooltip");
          this._toolTipService.getToolTipText().subscribe(
          (resp)=>{
            console.log('Tooltip api called');
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
  logo = environment.logoImg;
  authSignInFormSub() {
    if (!this.authSignInForm.valid) {
      return;
    }
    let authSigninReqData = this.authSignInForm.value;
    let reqData = {
      user: authSigninReqData.user.toString().trim(),
      password: authSigninReqData.password,
    };
    this._providerAdminAuthService.adminSignIn(reqData).subscribe(
      (res) => {
        this.authSignInForm.reset();
      },
      (err) => {
        const error = err.error;
        if (error.status === 'failure')
          this.notify.showNotification(error.message, 'top', 'error');
      }
    );
  }

  getUserType(userType: string) {
    this.userType = userType;
  }
}
