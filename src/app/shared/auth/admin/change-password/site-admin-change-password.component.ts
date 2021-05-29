import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordContext } from 'src/app/shared/helpers/constant';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { AdminService } from '../../../../core';
import { AdminAuthService } from 'src/app/core';

@Component({
  selector: 'app-site-admin-change-password',
  templateUrl: './site-admin-change-password.component.html',
  styleUrls: ['./site-admin-change-password.component.scss'],
})
export class adminChangePasswordComponent implements OnInit {
  passwordContext = passwordContext;
  authNewPasswordForm: FormGroup;
  hide: boolean = true;
  phoneNumber: string;
  currrentUser: any | null;
  currentAuthLoggedKey: string;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private notify: NotificationService,
    private adminService: AdminService,
    private adminAuthService: AdminAuthService,
  ) { }
  ngOnInit(): void {
    this.currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key');
    this.currrentUser = JSON.parse(localStorage.getItem(this.currentAuthLoggedKey));
    this.phoneNumber = this.activatedRoute.snapshot.params['number'];
    this.buildForm();
  }

  buildForm() {
    this.authNewPasswordForm = this._formBuilder.group({
      userName: ['', [Validators.required]],
      oldPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordContext.passwordMinLen),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordContext.passwordMinLen),
          Validators.pattern("^(?=.*[0-9])"
      + "(?=.*[a-z])(?=.*[A-Z])"
      + "(?=.*[!@#$%^&+=])"
      + "(?=\\S+$).{8,15}$"),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordContext.passwordMinLen),
        ],
      ],
    });
  }

  changePasswordHandler() {
    if (!this.authNewPasswordForm.valid) {
      return;
    }

    let changePasswordReq = {
      accessToken: this.currrentUser.access_token,
      oldPassword: this.authNewPasswordForm.value.oldPassword,
      newPassword: this.authNewPasswordForm.value.confirmPassword,
    };

    this.adminService
      .changePassword(changePasswordReq)
      .subscribe(
        (res) => {
          this.notify.showNotification(
            'Your password has been changed successfully!',
            'top',
            'success'
          );
          this.adminAuthService.adminSignOut(false);
        },
        (err) => {
          const error = err.error;
          if (error.status === 'failure') {
            this.notify.showNotification(`${error.message}`, 'bottom', 'error');
          }
        }
      );
  }

  getErrorMessageForPassword() {
    if (this.authNewPasswordForm.controls.password.hasError('required')) {
      return 'Password is required';
    }
    else if (this.authNewPasswordForm.controls.password.hasError('pattern')) {
      return `Password must be use 8-15 characters 1 uppercase, lowercase, numbers, special characters.`;
    }
     else {
      return `Password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }

  getErrorMessageForOldPassword() {
    if (this.authNewPasswordForm.controls.oldPassword.hasError('required')) {
      return 'Old password is required';
    } else {
      return `Old password must be at least ${this.passwordContext.passwordMinLen} digit.`;
    }
  }

  getErrorMessageForConfirmPassword() {
    if (
      this.authNewPasswordForm.controls.confirmPassword.hasError('required')
    ) {
      return 'Confirm password is required';
    } else if (
      this.authNewPasswordForm.controls.confirmPassword.hasError('notSame')
    ) {
      return 'Password and confirm password does not match';
    } else {
      return `Confirm password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }
}
