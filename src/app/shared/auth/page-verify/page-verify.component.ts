import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RecipientAuthService } from '../../../core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-verify',
  templateUrl: './page-verify.component.html',
  styleUrls: ['./page-verify.component.scss'],
})
export class PageVerifyComponent implements OnInit {
  authVerifyForm: FormGroup;
  email: string;
  user: string;
  @ViewChild('secondDigit') secondDigit: ElementRef;
  @ViewChild('thirdDigit') thirdDigit: ElementRef;
  @ViewChild('fourthDigit') fourthDigit: ElementRef;
  @ViewChild('fifthDigit') fifthDigit: ElementRef;
  @ViewChild('sixDigit') sixDigit: ElementRef;
  mobile_number: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private _NotificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this._providerRecipientAuthService.currentRecipient.subscribe(
      (currentRecipient: any) => {
        this.user = currentRecipient.user ? currentRecipient.user : '';
        this.mobile_number = currentRecipient.mobile_number
          ? currentRecipient.mobile_number
          : '';
        this.email = currentRecipient.email ? currentRecipient.email : '';
      }
    );
    this.buildPageVerifyForm();
  }

  buildPageVerifyForm() {
    this.authVerifyForm = this._formBuilder.group({
      firstDigit: ['', [Validators.required]],
      secondDigit: ['', [Validators.required]],
      thirdDigit: ['', [Validators.required]],
      fourthDigit: ['', [Validators.required]],
      fifthDigit: ['', [Validators.required]],
      sixDigit: ['', [Validators.required]],
    });
  }

  pageVerifysub() {
    if (!this.authVerifyForm.valid) {
      return this._NotificationService.showNotification(
        'Please enter the Verification code',
        'top',
        'error'
      );
    }
    const confirmationCode = Object.values(this.authVerifyForm.value).join('');
    const reqData = {
      user: this.user,
      code: confirmationCode.toString(),
    };

    this._providerRecipientAuthService.recipientVerifyCode(reqData).subscribe(
      (res) => {
        this._NotificationService.showNotification(
          'Recipient successfully registered',
          'top',
          'success'
        );
        this._router.navigate(['/auth/sign-in']);
        if (res.jwt) {
          // this._router.navigate(['/recipient/dashboard']);
        }
        // if (res.result === 'SUCCESS') {
        //   this._router.navigate(['/auth/sign-in'])
        // } else {
        //   const err = res.err;
        //   if (err.code === 'ExpiredCodeException') {
        //     return alert(err.message);
        //   }
        //   if (err.code === 'CodeMismatchException') {
        //     return alert(err.message);
        //   }
        //   if (err.code === 'SerializationException') {
        //     return alert(err.message);
        //   }
      },
      (err) => {
        // return alert('something went wrong')
        return this._NotificationService.showNotification(
          'please Enter The Valid Verification Code',
          'top',
          'error'
        );
      }
    );
  }
  onKey(value: string) {
    if (value == 'secondDigit') {
      this.secondDigit.nativeElement.focus();
    } else if (value == 'thirdDigit') {
      this.thirdDigit.nativeElement.focus();
    } else if (value == 'fourthDigit') {
      this.fourthDigit.nativeElement.focus();
    } else if (value == 'fifthDigit') {
      this.fifthDigit.nativeElement.focus();
    } else if (value == 'fifthDigit') {
      this.fifthDigit.nativeElement.focus();
    } else if (value == 'sixDigit') {
      this.sixDigit.nativeElement.focus();
    }

    // alert('hi')
  }

  resend() {
    let user = {
      user: this.user,
    };
    this._providerRecipientAuthService.resendCode(user).subscribe(
      (res) => {
        this._NotificationService.showNotification(
          'Verification Code Sent On Your Registered Mobile Phone Number',
          'top',
          'success'
        );
      },
      (err) => {
        this._NotificationService.showNotification(
          'please check your registered Mobile Phone Number',
          'top',
          'error'
        );
      }
    );
  }
}
