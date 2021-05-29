import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { passwordContext } from '../../../helpers/constant';
import { NotificationService } from '../../../services/notification.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../../core';


@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  styleUrls: ['./admin-reset-password.component.scss']
})
export class AdminResetPasswordComponent implements OnInit {
  passwordContext = passwordContext;
  forgotPasswordForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AdminAuthService,
    private router: Router,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    this.builForm()
  }

  builForm() {
    this.forgotPasswordForm = this._formBuilder.group({
      user: ['', [Validators.required]]
    }

    )
  }

  onUserIdSub() {
    if (!this.forgotPasswordForm.valid) {
      return;
    }
    console.log(this.forgotPasswordForm);
    this.authService.resetPassword(this.forgotPasswordForm.value).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.notify.showNotification(
            `${res.message} to ${res.detail.CodeDeliveryDetails.Destination}`,
            'top',
            'success'
          );
          this.router.navigate(['/auth/admin-new-password', this.forgotPasswordForm.value]);
        }
      },
      (err) => {
        this.notify.showNotification('Something went wrong', 'bottom', 'error');
      }
    );
  }



  // checkForUserPrimaryTypeFun() {
  //   this.phoneEmailInputToggler = !isNaN(this.userId.value);
  //   if (this.phoneEmailInputToggler) {
  //     setTimeout(() => {
  //       this.phoneInput.nativeElement.focus();
  //     }, 0);
  //   } else {
  //     setTimeout(() => {
  //       this.emailInput.nativeElement.focus();
  //     }, 0);
  //   }
  // }
}
