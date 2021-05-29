import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipientRouteGuard, AdminRouteGuard } from 'src/app/core';
import { AuthComponent } from './auth.component';
import { PageSignInComponent } from './page-sign-in/page-sign-in.component';
import { PageSignUpComponent } from './page-sign-up/page-sign-up.component';
import { PageVaccinatorSignUpComponent } from './page-vaccinator-sign-up/page-vaccinator-sign-up.component';
import { adminSignInComponent } from './admin/sign-in/page-vaccinator-sign-in.component';
import { PageVerifyComponent } from './page-verify/page-verify.component';
import { PageResetPasswordComponent } from './page-reset-password/page-reset-password.component';
import { PageEmailComponent } from './page-email/page-email.component';
import { PageNewPasswordComponent } from './page-new-password/page-new-password.component';
import { PageChnagePasswordComponent } from './page-chnage-password/page-chnage-password.component';
import { PageRegisterQuesAnsComponent } from './page-register-ques-ans/page-register-ques-ans.component';
import { adminChangePasswordComponent } from './admin/change-password/site-admin-change-password.component';
import { PageMfaComponent } from './page-mfa/page-mfa.component';
import { PageMfaVaccinatorSiteAdminComponent } from './page-mfa-vaccinator-site-admin/page-mfa-vaccinator-site-admin.component';
import { PageMyProfileComponent } from './admin/page-my-profile/page-my-profile.component';
import { PageEditProfileComponent } from './admin/page-edit-profile/page-edit-profile.component';
import { PageAdminSetNewPasswordComponent } from './admin/page-admin-set-new-password/page-admin-set-new-password.component';
import { PageRecipientSetNewPasswordComponent } from './admin/page-recipient-set-new-password/page-recipient-set-new-password.component';
import { AdminResetPasswordComponent } from './admin/admin-reset-password/admin-reset-password.component';
import { AdminNewPasswordComponent } from './admin/admin-new-password/admin-new-password.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-up' },
      { path: 'sign-in', component: PageSignInComponent },
      { path: 'verify-otp', component: PageVerifyComponent },
      { path: 'sign-up', component: PageSignUpComponent },
      { path: 'vaccinator-sign-in', component: adminSignInComponent },
      { path: 'vaccinator-sign-up', component: PageVaccinatorSignUpComponent },
      { path: 'reset-password', component: PageResetPasswordComponent },
      { path: 'change-password/:number', component: PageChnagePasswordComponent, canActivate: [RecipientRouteGuard] },
      { path: 'email', component: PageEmailComponent },
      { path: 'new-password/:number', component: PageNewPasswordComponent },
      { path: 'register-ques-ans', component: PageRegisterQuesAnsComponent },
      { path: 'admin-change-password', component: adminChangePasswordComponent, canActivate: [AdminRouteGuard] },
      { path: 'verify-otp-mfa', component: PageMfaComponent },
      { path: 'admin-verify-otp-mfa', component: PageMfaVaccinatorSiteAdminComponent },
      { path: 'admin-my-profile', component: PageMyProfileComponent,data: {location: 'admin_profile'}, canActivate: [AdminRouteGuard] },
      { path: 'admin-edit-profile', component: PageEditProfileComponent,data: {location: 'admin_profile'}, canActivate: [AdminRouteGuard] },
      { path: 'admin-set-new-password', component: PageAdminSetNewPasswordComponent},
      { path: 'recipient-set-new-password', component: PageRecipientSetNewPasswordComponent},
      { path: 'admin-reset-password', component: AdminResetPasswordComponent },
      { path: 'admin-new-password', component: AdminNewPasswordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
