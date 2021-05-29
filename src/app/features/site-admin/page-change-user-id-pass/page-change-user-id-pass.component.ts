import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from 'src/app/core';
import { ILoginResContext } from 'src/app/shared/auth/models/loginResContext';
import { passwordContext } from 'src/app/shared/helpers/constant';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-page-change-user-id-pass',
  templateUrl: './page-change-user-id-pass.component.html',
  styleUrls: ['./page-change-user-id-pass.component.scss']
})
export class PageChangeUserIdPassComponent implements OnInit {

  passwordContext = passwordContext;
  authNewPasswordForm: FormGroup;
  hide: boolean = true;
  phoneNumber: string;
  currrentUser: ILoginResContext | null;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private notify: NotificationService,
    private providerAdminAuthService: AdminAuthService

  ) { }
  ngOnInit(): void {
    this.phoneNumber = this.activatedRoute.snapshot.params['number'];
    this.buildForm();
  }

  buildForm() {
    this.currrentUser = JSON.parse(localStorage.getItem('loggedinUser')) as ILoginResContext;
    this.authNewPasswordForm = this._formBuilder.group({
      userName: ['', [Validators.required]],
      oldPassword: ['', [Validators.required, Validators.minLength(this.passwordContext.passwordMinLen)]],
      password: ['', [Validators.required, Validators.minLength(this.passwordContext.passwordMinLen), Validators.pattern("^(?=.*[0-9])"
      + "(?=.*[a-z])(?=.*[A-Z])"
      + "(?=.*[!@#$%^&+=])"
      + "(?=\\S+$).{8,15}$")]],
      confirmPassword: ['', [Validators.required, Validators.minLength(this.passwordContext.passwordMinLen)]],
    });
  }

  changePasswordHandler() {
    if (!this.authNewPasswordForm.valid) {
      return;
    }
    let newChangedPasswordData = {
      user: this.authNewPasswordForm.value.userName,
      temporaryPassword: this.authNewPasswordForm.value.oldPassword,
      newPassword: this.authNewPasswordForm.value.confirmPassword,
    };

    // this.providerAdminAuthService.changePassword(newChangedPasswordData).subscribe(
    //   (res) => {
    //     this.notify.showNotification('Your password has been changed successfully!', 'top', 'success');
    //     if (this.currrentUser.user_type === 'site_admin')
    //       this._router.navigate(['//auth/vaccinator-sign-in']);
    //     // if (this.currrentUser.user_type === 'vaccinator') {
    //     //   this._router.navigate(['/auth/vaccinator-sign-in']);
    //     // }
    //   },
    //   (err) => {
    //     const error = err.error;
    //     if (error.status === 'failure') {
    //       this.notify.showNotification('incorrect old password', 'bottom', 'error');
    //     }
    //   }
    // );
  }


  getErrorMessageForPassword() {
    if (this.authNewPasswordForm.controls.password.hasError('required')) {
      return 'Password is required';
    }else if (this.authNewPasswordForm.controls.password.hasError('pattern')) {
      return `Password must be use 8-15 characters 1 uppercase, lowercase, numbers, special characters.`;
    } else {
      return `Password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }

  }

  getErrorMessageForOldPassword() {
    if (this.authNewPasswordForm.controls.oldPassword.hasError('required')) {
      return 'Old password is required';
    }else {
      return `Old password must be at least ${this.passwordContext.passwordMinLen} digit.`;
    }

  }

  getErrorMessageForConfirmPassword() {
    if (this.authNewPasswordForm.controls.confirmPassword.hasError('required')) {
      return 'Confirm password is required';
    } else if (this.authNewPasswordForm.controls.confirmPassword.hasError('notSame')) {
      return 'Password and confirm password does not match';
    } else {
      return `Confirm password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }

  }

}
