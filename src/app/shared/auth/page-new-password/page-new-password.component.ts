import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RecipientAuthService } from '../../../core';
import { passwordContext } from '../../helpers/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-new-password',
  templateUrl: './page-new-password.component.html',
  styleUrls: ['./page-new-password.component.scss'],
})
export class PageNewPasswordComponent implements OnInit {
  passwordContext = passwordContext;
  authNewPasswordForm: FormGroup;
  hide: boolean = true;
  phoneNumber: string;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private activatedRoute: ActivatedRoute,
    private notify: NotificationService
  ) {}
  ngOnInit(): void {
    this.phoneNumber = this.activatedRoute.snapshot.params['number'];
    this.buildForm();
  }

  buildForm() {
    this.authNewPasswordForm = this._formBuilder.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordContext.otpLen),
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

  resetPasswordHandler() {
    if (!this.authNewPasswordForm.valid) {
      return;
    }
    let newChangedPasswordData = {
      user: this.phoneNumber,
      code: this.authNewPasswordForm.value.code,
      password: this.authNewPasswordForm.value.confirmPassword,
    };

    this._providerRecipientAuthService
      .newPassword(newChangedPasswordData)
      .subscribe(
        (res) => {
          this.notify.showNotification(
            'Your password has been reset successfully!',
            'top',
            'success'
          );
          this.authNewPasswordForm.reset();
          this._router.navigate(['/auth/sign-in']);
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
    }else if (this.authNewPasswordForm.controls.password.hasError('pattern')) {
      return `Password must be use 8-15 characters 1 uppercase, lowercase, numbers, special characters.`;
    } else {
      return `Password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }

  getErrorMessageForOTP() {
    if (this.authNewPasswordForm.controls.code.hasError('required')) {
      return 'OTP is required';
    } else {
      return `OTP must be at least ${this.passwordContext.otpLen} digit.`;
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

  resend() {
    let email = {
      user: this.phoneNumber,
    };
    this._providerRecipientAuthService.resendCode(email).subscribe(
      (res) => {
        this.notify.showNotification(
          'OTP send on your registered Mobile Phone Number or Email Address',
          'top',
          'success'
        );
      },
      (err) => {
        console.log();
        this.notify.showNotification(
          'please check your registered Mobile Phone Number or Email Address',
          'top',
          'error'
        );
      }
    );
  }
}
