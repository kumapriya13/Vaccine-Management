import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ModalPreviewCertificateComponent,
} from 'src/app/shared/modals/modal-preview-certificate/modal-preview-certificate.component';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { RecipientService, UserService } from '../../../core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthManageService } from 'src/app/core';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';

@Component({
  selector: 'app-page-my-pofile',
  templateUrl: './page-my-pofile.component.html',
  styleUrls: ['./page-my-pofile.component.scss']
})

export class PageMyPofileComponent implements OnInit {
  url :any;
  responseFlag:boolean= false;
  imageFile:any;
  imageFileName:any;
  certificateUploaded:boolean=false;

  qrImageBase64: string = '';
  userDetails: any = {};
  recipientFacts: any = {};
  insoInfo: boolean = false
  insuranceInformation: any[] = [];
  columnText: string = ' :- ';
  mfaValue: boolean;
  dtest: string;
  decoded: any;
  profileImage:string;

  sendingEmailVerificationCode: boolean;
  sendingSmsVerificationCode: boolean;
  verifyingCode: boolean;

  codeInputDialogVisible: boolean;
  verificationCode: string;

  auth: any;

  recipientId: string;

  MAX_PROFILE_IMAGE_SIZE = 1024 * 1000 * 2;

  constructor(
    public authManageService: AuthManageService,
    private userService: UserService,
    private recipientService: RecipientService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private notify: NotificationService,
    private _NotificationService: NotificationService,
    public dialog: MatDialog,
    private ngbModal: NgbModal,
    private route: ActivatedRoute
  ) {
    this.auth = this.authManageService.getLoggedInUser();
    this.recipientId = this.route.snapshot.params?.id;
  }

  get isPrimaryProfile(): boolean {
    return !this.recipientId;
  }

  ngOnInit() {
    this.getProfileImage();
    this.recipientQRCode();

    this.getMfaValue();
    this.loadRecipient();
  }

  loadRecipient(): void {
    this.userService.getUserById(this.recipientId).subscribe(
      (res) => {
        this.userDetails = res;
        const answers: any[] = this.userDetails.static_questionnaire_answers;
     //   console.log(answers);
        this.handlerinsuranceInformation(answers)
        this.isPrimaryProfile && localStorage.setItem('recipientProfile', JSON.stringify(this.userDetails));
      },
      (err) => {
        console.log('Something went wrong ' + err.message)
      }
    );
  }

  handlerinsuranceInformation(answers: any[]) {
    if (!!answers && answers.length > 0) {
      const Insurance = answers.find(x => x.question_text === 'Insurance');
      const insuranceprovidername = answers.find(x => x.question_text.trim() === 'Insurance Provider Name');
      const medicalGroupNumber = answers.find(x => x.question_text === 'Medical Group Number');
      const memberId = answers.find(x => x.question_text.trim() === 'Medical ID');
      this.insuranceInformation.push(Insurance, insuranceprovidername, medicalGroupNumber, memberId);
    }
  }

  logOut() {
    window.localStorage.clear();
  }

  onEdit(): void {
    if (this.recipientId) {
      this._router.navigate(['recipient', 'edit-profile', this.recipientId]);
    } else {
      this._router.navigate(['recipient', 'edit-profile']);
    }
  }

  onQRCodeSelect(): void {
    this._router.navigate(this.recipientId ? ['recipient/edit-scan', this.recipientId] : ['recipient/edit-scan']);
  }

  linkRecipient() {
    if (!this.userDetails.valid) {
      return;
    }
    // let formValue = this.addVaccinatorForm.value;
    // formValue.phone = !formValue.phone.includes(this.dialCode)? `${this.dialCode}${formValue.phone}` : formValue.phone.slice(-`${10 + this.dialCode.length}`);
    this.recipientService.updateUserProfile(this.userDetails).subscribe(
      (res) => {
        if (res.status === "success") {
          const msg = 'link to generate bracelet updated successfully'
          this.notify.showNotification(msg, 'top', 'success');
          this._router.navigate(['/recipient/link-bracelet']);
        }
      },
      (err) => {
        const error = err.error;
        if (error.code === 'UsernameExistsException') {
          this.notify.showNotification(`${error.message}`, 'bottom', 'error');
        }
        if (error.code === 'InvalidParameterException') {
          this.notify.showNotification(`${error.message}`, 'bottom', 'error');
        }
      }
    );
  }

  setMfaValue(val) {
    this.userService.saveMfaFlag(val.checked).subscribe(
      (res) => {
        this.mfaValue = val.checked;
        localStorage.setItem('mfaFlag',JSON.stringify(val.checked));
      },
      (err) => {
        console.log('Error : ' + err);
      });
  }

  getMfaValue() {
    if(localStorage.getItem('mfaFlag') !== null){
      this.mfaValue = JSON.parse(localStorage.getItem('mfaFlag'));
    }else{
        this.userService.getMfaFlag().subscribe(
          (res) => {
            localStorage.setItem('mfaFlag',''+JSON.stringify(res.mfaEnabled));
            this.mfaValue = res.mfaEnabled;
          },
          (err) => {
            console.log('Error : ' + err);
          });
      }
  }

  recipientQRCode() {
    let reqData = {
      "$comment": "Find the render options here: https://www.npmjs.com/package/qrcode#renderers-options",
      "options": {
      },
      recipient_id: this.recipientId
    }
    this.userService.recipientQRCode(reqData).subscribe(res => {
      this.qrImageBase64 = res.code;
    }, err => {
      console.log(err);
    });
  }

  onSelectFile(event) {
   let file= event.target.files[0]
  //   if (!this.validateFile(files[0].name)) {
  //     console.log('Selected file format is not supported');
  //     return false;
  // }
    if (event.target.files && event.target.files[0]) {
      if (file.size > this.MAX_PROFILE_IMAGE_SIZE)  {
        this._NotificationService.showNotification("File size should not exceed 2MB.", "top", 'error');
        return;
      }
      this.imageFileName = event.target.files[0].name;
      if(!this.validateFile(this.imageFileName)){
        return false;
      }
      else{
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url = event.target.result;
          this.imageFile = event.target.result;
         // console.log('imageFile : '+this.imageFile);
        //  console.log('imageFileName : '+this.imageFileName);
          this.uploadProfileImage(this.imageFile, this.imageFileName);
        }
      }


    }
  }
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    console.log(ext)
    if (ext.toLowerCase() == 'png'||ext.toLowerCase() == 'PNG'||ext.toLowerCase() == 'jpg'||ext.toLowerCase() == 'jpeg'||ext.toLowerCase() == 'jfif'||ext.toLowerCase() == 'pjpeg'||ext.toLowerCase() == 'pjp') {
        return true;
    }
    else {
      this._NotificationService.showNotification("Please upload only jpg and png image.", "top", 'error');

    }
}

  onSelectCertificateFile(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > this.MAX_PROFILE_IMAGE_SIZE)  {
        this._NotificationService.showNotification("File size should not exceed 2MB.", "top", 'error');
        return;
      }

      this.imageFileName = event.target.files[0].name;
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
        this.imageFile = event.target.result;
        //console.log('imageFile : '+this.imageFile);
        //console.log('imageFileName : '+this.imageFileName);
        this.uploadCertificate(this.imageFile, this.imageFileName);
      }
    }
  }

    uploadProfileImage(imageFile,imageFileName){
      this.recipientService.uploadProfileImage(imageFile,imageFileName, this.recipientId).subscribe(res => {
       // console.log(res);
        this.getProfileImage();
      }, err => {
          if(err.status==413)
              return this._NotificationService.showNotification("Image size it too large.", "top", 'error');
          console.log(err);
      });
    }

    getProfileImage(){
      this.recipientService.getProfileImage(this.recipientId).subscribe(res => {
        //debugger;
        console.log(res)
        this.profileImage = res.image;
        console.log(res.image);
        this.responseFlag = true;
      }, err => {
        this.responseFlag = true;
        console.log(err);
      });
    }

    removeProfile_img() {
      const config = {
        disableClose: true,
        data: { title: 'Do you want to delete your profile picture?' }
      };
      const dialogRef = this.dialog.open(ConfirmationAlertComponent, config);
      dialogRef.afterClosed().subscribe((result) => {
        if (result.state) {
          this.recipientService.removeProfileImage(this.recipientId).subscribe(res => {
            //debugger;
            this.profileImage = res.image;
            //console.log(res);
            //this.loadRecipient();
            // window.location.reload();
            //this.responseFlag = true;
            //console.log(res);
          }, err => {
            this.responseFlag = true;
            console.log(err);
          });
        }
      });
    }

    uploadCertificate(imageFile,imageFileName){
      this.recipientService.uploadCertificate(imageFile,imageFileName, this.recipientId).subscribe(res => {
        //console.log(res);
       this.certificateUploaded = true;
       this._NotificationService.showNotification("Certificate uploaded successfully", "top", 'success')
      }, err => {
          if(err.status==413)
              return this._NotificationService.showNotification("Image size it too large.", "top", 'error');
          console.log(err);
      });
    }

    openFile(fileInputCert){
        fileInputCert.click();
    }

    previewCertificate() {
      let config = {
        height: '90%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        data: { recipient_id: this.recipientId }
      };
      const dialogRef = this.dialog.open(ModalPreviewCertificateComponent, config);
      dialogRef.afterClosed().subscribe((result) => { });
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(ModalPreviewCertificateComponent, {
        height: '60%',
        width: '80vw'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

    sendEmailVerificationCode(modal: any): void {
      this.sendingEmailVerificationCode = true;
      this.recipientService.sendEmailVerificationCode().pipe(
        catchError((err) => {
          this.sendingEmailVerificationCode = false;
          return throwError(err);
      })).subscribe((res) => {
        this.openVerificationCodeDialog(modal);
      });
    }

    sendSmsVerificationCode(modal: any): void {
      this.sendingSmsVerificationCode = true;
      this.recipientService.sendSmsVerificationCode().pipe(
        catchError((err) => {
          this.sendingSmsVerificationCode = false;
          return throwError(err);
      })).subscribe((res) => {
        this.openVerificationCodeDialog(modal);
      });
    }

    openVerificationCodeDialog(modal): void {
      this.ngbModal.open(modal).result.then(() => {
        console.log('hello');
      }).finally(() => {
        this.sendingEmailVerificationCode = false;
        this.sendingSmsVerificationCode = false;
        this.verifyingCode = false;
        this.verificationCode = '';
      })
    }

    onVerificationCodeChanged(e): void {
      this.verificationCode = e;
    }

    onVerificationCodeCompleted(e): void {
      this.verifyingCode = true;
      const call = this.sendingEmailVerificationCode ?
          this.recipientService.verifyEmailCode(this.verificationCode) :
          this.recipientService.verifySmsCode(this.verificationCode);
      call.pipe(catchError((err) => {
        this.verifyingCode = false;
        return throwError(err);
      })).subscribe(() => {
        if (this.sendingSmsVerificationCode) {
          this.authManageService.setMobileNumberVerified()
        } else {
          this.authManageService.setEmailVerified();
        }
        this.ngbModal.dismissAll();
        this.loadRecipient();
        location.reload();
      })
    }

    enableDisableMfaSwitch():boolean {
      if(this.authManageService.getLoggedInUser()?.email_verified
        && this.authManageService.getLoggedInUser()?.phone_number_verified){
          return true;
        }
       return false;
   }
}
