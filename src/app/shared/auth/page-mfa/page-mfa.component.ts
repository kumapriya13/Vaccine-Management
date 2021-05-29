import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthManageService, RecipientAuthService } from '../../../core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-page-mfa',
  templateUrl: './page-mfa.component.html',
  styleUrls: ['./page-mfa.component.scss']
})
export class PageMfaComponent implements OnInit {

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
    private _NotificationService: NotificationService,
    private authManageService:AuthManageService

  ) { }

  ngOnInit(): void {
    this._providerRecipientAuthService.currentRecipient.subscribe((currentRecipient: any) => {
      this.user = currentRecipient.user ? currentRecipient.user : '';
      this.mobile_number = currentRecipient.mobile_number ? currentRecipient.mobile_number : '';
      this.email = currentRecipient.email ? currentRecipient.email : '';
      console.log(currentRecipient);
    });
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
      return this._NotificationService.showNotification("Please enter the Verification code","top",'error')
    }
    const confirmationCode = Object.values(this.authVerifyForm.value).join('');
    let session = JSON.parse(localStorage.getItem('currentRecipient')).session;
    if(this.user=='' || this.user == null)
          this.user = localStorage.getItem('_authUser') ;

    const reqData = {
      user: this.user,
      code: confirmationCode.toString(),
      session: session
    };

    console.log("Request data pageVerifysub : "+reqData);
    this._providerRecipientAuthService.recipientVerifyCodeMfa(reqData).subscribe(
      res => {         
         let object = res;
         if(res.jwt) {          
          let jwtDecodedToken = jwt_decode(res.jwt);
          object['phone_number_verified']   =  jwtDecodedToken['phone_number_verified'];
          object['email_verified']          =  jwtDecodedToken['email_verified'];         
         }
         this.authManageService.saveAuth(object);
         
         localStorage.setItem('currentRecipient', JSON.stringify(res));
         this._router.navigate(['/recipient/dashboard']);
         //this._router.navigate(['/auth/sign-in']);
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
      }, (err) => {
        // return alert('something went wrong')
        return this._NotificationService.showNotification("Please enter valid Verification Code","top",'error');
      }
    );
  }
  onKey(value: string) {
    //console.log(this.authVerifyForm.get('fourthDigit').focus());
    if (value == 'secondDigit') {
      this.secondDigit.nativeElement.focus();
    }
    else if (value == 'thirdDigit') {
      this.thirdDigit.nativeElement.focus();
    }
    else if (value == 'fourthDigit') {
      this.fourthDigit.nativeElement.focus();
    }
    else if (value == 'fifthDigit') {
      this.fifthDigit.nativeElement.focus();
    }
    else if (value == 'fifthDigit') {
      this.fifthDigit.nativeElement.focus();
    }
    else if (value == 'sixDigit') {
      this.sixDigit.nativeElement.focus();
    }

    // alert('hi')
  }

  // resend(){
  //   console.log(this.email)
  //   if(this.email=='' || this.email==null)
  //        this.email = localStorage.getItem('_authUser') ;

  //   let email=
  //   {
  //     "user" : this.email
  //   }
  //   this._providerRecipientAuthService.resendCode(email).subscribe(
  //     res => {
  //       this._NotificationService.showNotification("Verification Code sent on your Registered Mobile Phone Number","top",'success')
  //     },
  //     err => {
  //       console.log();
  //       this._NotificationService.showNotification("Please check your Registered Mobile Phone Number","top",'error')
  //     }
  //   );
  // }
}
