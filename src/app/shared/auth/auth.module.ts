import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from 'src/app/shared/shared.module';

import { JwtInterceptor } from '../../core';
import { ErrorRecipientInterceptor } from '../helpers/error-recipient.interceptor';
import { adminChangePasswordComponent } from './admin/change-password/site-admin-change-password.component';
import { PageAdminSetNewPasswordComponent } from './admin/page-admin-set-new-password/page-admin-set-new-password.component';
import { PageEditProfileComponent } from './admin/page-edit-profile/page-edit-profile.component';
import { PageMyProfileComponent } from './admin/page-my-profile/page-my-profile.component';
import { PageRecipientSetNewPasswordComponent } from './admin/page-recipient-set-new-password/page-recipient-set-new-password.component';
import { adminSignInComponent } from './admin/sign-in/page-vaccinator-sign-in.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { PageChnagePasswordComponent } from './page-chnage-password/page-chnage-password.component';
import { PageEmailComponent } from './page-email/page-email.component';
import {
  PageMfaVaccinatorSiteAdminComponent,
} from './page-mfa-vaccinator-site-admin/page-mfa-vaccinator-site-admin.component';
import { PageMfaComponent } from './page-mfa/page-mfa.component';
import { PageNewPasswordComponent } from './page-new-password/page-new-password.component';
import { PageRegisterQuesAnsComponent } from './page-register-ques-ans/page-register-ques-ans.component';
import { PageResetPasswordComponent } from './page-reset-password/page-reset-password.component';
import { PageSignInComponent } from './page-sign-in/page-sign-in.component';
import { PageSignUpComponent } from './page-sign-up/page-sign-up.component';
import { PageVaccinatorSignUpComponent } from './page-vaccinator-sign-up/page-vaccinator-sign-up.component';
import { PageVerifyComponent } from './page-verify/page-verify.component';
import { AdminResetPasswordComponent } from './admin/admin-reset-password/admin-reset-password.component';
import { AdminNewPasswordComponent } from './admin/admin-new-password/admin-new-password.component';


@NgModule({
  declarations: [
    AuthComponent,
    PageSignInComponent,
    PageSignUpComponent,
    PageVaccinatorSignUpComponent,
    adminSignInComponent,
    PageVerifyComponent,
    PageResetPasswordComponent,
    PageEmailComponent,
    PageNewPasswordComponent,
    PageChnagePasswordComponent,
    PageRegisterQuesAnsComponent,
    adminChangePasswordComponent,
    PageMfaComponent,
    PageMfaVaccinatorSiteAdminComponent,
    PageMyProfileComponent,
    PageEditProfileComponent,
    PageAdminSetNewPasswordComponent,
    PageRecipientSetNewPasswordComponent,
    AdminResetPasswordComponent,
    AdminNewPasswordComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthRoutingModule,
    Ng2TelInputModule,
    SharedModule,
    NgxCaptchaModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorRecipientInterceptor, multi: true },
    DatePipe
  ]
})
export class AuthModule { }
