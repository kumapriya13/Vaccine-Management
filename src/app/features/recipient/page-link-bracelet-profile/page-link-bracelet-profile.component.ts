import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
import { RecipientService, UserService } from '../../../core';

@Component({
  selector: 'app-page-link-bracelet-profile',
  templateUrl: './page-link-bracelet-profile.component.html',
  styleUrls: ['./page-link-bracelet-profile.component.scss']
})
export class PageLinkBraceletProfileComponent implements OnInit {
  userDetails:any;
  visibleLink = null;
  qrCodeNumberInput:string='';
  profileImage:string='';
  responseFlag:boolean=false;
  recipientId: string;
  qrImageBase64:string='';
  imageFileName: any;
  url: string | ArrayBuffer;
  imageFile: string | ArrayBuffer;
  constructor(
    private userService: UserService,
    private recipientService: RecipientService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private notify: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('recipientProfile'));
    this.recipientQRCode();
    this.getProfileImage();
  }

  ngAfterViewInit(){
      this.getProfileImage();
  }

  recipientQRCode() {
    let reqData = {
      "$comment": "Find the render options here: https://www.npmjs.com/package/qrcode#renderers-options",
      "options": {
      }
    }
    this.userService.recipientQRCode(reqData).subscribe(res => {
      this.qrImageBase64 = res.code;
    }, err => {
      console.log(err);
    });
  }

  loadQrCode() {
    this.recipientService.getQrCode().subscribe(
      res => {
        console.log(res.results);
        // this.qrCode = res.results;
      },
      err => {
        console.log(err);
      }
    );
  }

  isBraceletLinkWithReceipient() {
    this.recipientService.isBraceletLinkWithReceipient().subscribe(
      res => {
        console.log(res.results);
        this.isBraceletLinkWithReceipient = res.results;
        if (this.isBraceletLinkWithReceipient) {
          this.visibleLink = null;
        }
        else {
          this.visibleLink = "http://bracelet.2120check.com/QX779349XR";
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  linkBracelet() {
    let reqData = {
      "bracelet_url":"https://2120check.com/recipient/"+this.qrCodeNumberInput
    }
    this.userService.saveRecipientProfile(reqData).subscribe(res => {
      this.notify.showNotification("bracelet linked successfully", 'top', 'success');
      this._router.navigate(['/recipient/profile']);
      console.log(res);
    }, err => {
      console.log(err);
    });
  }
  onSelectFile(event) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
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
    if (ext.toLowerCase() == 'png'||ext.toLowerCase() == 'jpg'||ext.toLowerCase() == 'jpeg'||ext.toLowerCase() == 'jfif'||ext.toLowerCase() == 'pjpeg'||ext.toLowerCase() == 'pjp') {
        return true;
    }
    else {
      this.notify.showNotification("Please upload only jpg and png image.", "top", 'error');
    }
}
  uploadProfileImage(imageFile,imageFileName){
    this.recipientService.uploadProfileImage(imageFile,imageFileName, this.recipientId).subscribe(res => {
     // console.log(res);
      this.getProfileImage();
    }, err => {
        if(err.status==413)
            return this.notify.showNotification("Image size it too large.", "top", 'error');
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
  
  // removeProfile_img(){
  //   this.recipientService.removeProfileImage(this.recipientId).subscribe(res => {
  //     //debugger;
  //     this.profileImage = res.image;
  //    // console.log(res);
  //   //  location.reload();
  //     //this.responseFlag = true;
  //     //console.log(res);
  //   }, err => {
  //     this.responseFlag = true;
  //     console.log(err);
  //   });
  // }
  getProfileImage(){
    this.recipientService.getProfileImage().subscribe(res => {
      //debugger;
      this.profileImage = res.image;
      this.responseFlag = true;
      //console.log(res);
    }, err => {
      this.responseFlag = true;
      console.log(err);
    });
  }
}
