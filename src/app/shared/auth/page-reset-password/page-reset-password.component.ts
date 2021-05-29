import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RecipientAuthService } from '../../../core';
import { passwordContext } from '../../helpers/constant';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-reset-password',
  templateUrl: './page-reset-password.component.html',
  styleUrls: ['./page-reset-password.component.scss'],
})
export class PageResetPasswordComponent implements OnInit {
  dialCode: string = '+1';
  passwordContext = passwordContext;

  @ViewChild('phoneInput') phoneInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  phoneEmailInputToggler = true;

  mobileNumberControl: FormControl = new FormControl(null, [
    Validators.required
  ]);

  constructor(
    private authService: RecipientAuthService,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {}

  onCountryChange(event) {
    this.dialCode = '+' + event.dialCode;
  }

  onPhoneIdSub() {
    if (!this.mobileNumberControl.valid) {
      return;
    }
    const user = this.phoneEmailInputToggler
      ? this.dialCode + this.mobileNumberControl.value
      : this.mobileNumberControl.value;

    this.authService.resetPassword(user).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.notify.showNotification(
            `${res.message} to ${user}`,
            'top',
            'success'
          );
          this.router.navigate(['/auth/new-password', user]);
        }
      },
      (err) => {
        this.notify.showNotification('Something went wrong', 'bottom', 'error');
      }
    );
  }

  getValidationMsg() {
    if (this.mobileNumberControl.hasError('Mobile Phone Number or Email Address is required'))
      return ;
    // else
    //   return `Mobile Phone number must be ${this.passwordContext.phoneNumberLen} digit.`;
  }

  checkForUserPrimaryTypeFun() {
    this.phoneEmailInputToggler = !isNaN(this.mobileNumberControl.value);
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
}
