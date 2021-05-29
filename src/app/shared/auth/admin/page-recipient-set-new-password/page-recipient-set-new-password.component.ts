import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from 'src/app/core';
import { ILoginResContext } from 'src/app/shared/auth/models/loginResContext';
import { passwordContext } from 'src/app/shared/helpers/constant';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RecipientAuthService } from '../../../../core/services/auth/recipient-auth.service';

@Component({
  selector: 'app-page-recipient-set-new-password',
  templateUrl: './page-recipient-set-new-password.component.html',
  styleUrls: ['./page-recipient-set-new-password.component.scss'],
})
export class PageRecipientSetNewPasswordComponent implements OnInit {
  passwordContext = passwordContext;
  authNewPasswordForm: FormGroup;
  hide: boolean = true;
enable :boolean = true;
  newSetPasswordUser: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private notify: NotificationService,
    private recipientAuthService: RecipientAuthService,
  ) {}

  ngOnInit(): void {
    this.newSetPasswordUser = localStorage.getItem('new-set-password-user');
    this.enable = this.newSetPasswordUser ? true : false;
    this.buildForm();
  }

  buildForm() {
    this.authNewPasswordForm = this._formBuilder.group({
      userName: [this.newSetPasswordUser, [Validators.required]],
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

    let newChangedPasswordData = {
      user: this.authNewPasswordForm.value.userName,
      temporaryPassword: this.authNewPasswordForm.value.oldPassword,
      newPassword: this.authNewPasswordForm.value.confirmPassword,
    };

    this.recipientAuthService
      .confirmNewRecipient(newChangedPasswordData)
      .subscribe(
        (res) => {
          this.notify.showNotification(
            'Your password has been changed successfully!',
            'top',
            'success'
          );
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

  getErrorMessageForOldPassword() {
    if (this.authNewPasswordForm.controls.oldPassword.hasError('required')) {
      return 'Old password is required';
    }else {
      return `Old password must be at least ${this.passwordContext.passwordMinLen} digit.`;
    }
  }

  getErrorMessageForConfirmPassword() {
    if (
      this.authNewPasswordForm.controls.confirmPassword.hasError('required')
    ) {
      return 'Confirm password is required';
    }
      else if (
      this.authNewPasswordForm.controls.confirmPassword.hasError('notSame')
    ) {
      return 'Password and confirm password does not match';
    } else {
      return `Confirm password must be at least ${this.passwordContext.passwordMinLen} characters.`;
    }
  }
}
