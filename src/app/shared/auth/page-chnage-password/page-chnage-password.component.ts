import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RecipientAuthService } from '../../../core';
import { passwordContext } from '../../helpers/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-chnage-password',
  templateUrl: './page-chnage-password.component.html',
  styleUrls: ['./page-chnage-password.component.scss'],
})
export class PageChnagePasswordComponent implements OnInit {
  passwordContext = passwordContext;
  authNewPasswordForm: FormGroup;
  hide: boolean = true;
  user: string;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private activatedRoute: ActivatedRoute,
    private notify: NotificationService
  ) {}
  ngOnInit(): void {
    this.user = this.activatedRoute.snapshot.params['number'];
    this.buildForm();
  }

  buildForm() {
    this.authNewPasswordForm = this._formBuilder.group({
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
    let recpUser:any = JSON.parse(window.localStorage.getItem('currentRecipient'));
    let newChangedPasswordData = {
      accessToken: recpUser.access_token,
      oldPassword: this.authNewPasswordForm.value.oldPassword,
      newPassword: this.authNewPasswordForm.value.confirmPassword,
    };

    this._providerRecipientAuthService
      .changePassword(newChangedPasswordData)
      .subscribe(
        (res) => {
          this.notify.showNotification(
            'Your password has been changed successfully!',
            'top',
            'success'
          );
          this.authNewPasswordForm.reset();
          this._providerRecipientAuthService.recipientSignOut(false);
        },
        (err) => {
          const error = err.error;
          if (error.status === 'failure') {
            this.notify.showNotification(
              `incorrect old password`,
              'bottom',
              'error'
            );
          }
        }
      );
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
