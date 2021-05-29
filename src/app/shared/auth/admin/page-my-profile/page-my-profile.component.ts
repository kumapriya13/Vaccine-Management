import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminAuthService, AdminService, AuthManageService } from 'src/app/core';

@Component({
  selector: 'app-page-my-profile',
  templateUrl: './page-my-profile.component.html',
  styleUrls: ['./page-my-profile.component.scss'],
})
export class PageMyProfileComponent implements OnInit {
  qrImageBase64: string = '';
  userDetails: any = {};
  recipientFacts: any = {};
  insoInfo: boolean = false;
  insuranceInformation: any[] = [];
  columnText: string = ' :- ';
  mfaValue: boolean;
  dtest: string;
  decoded: any;
  currentAuthLoggedKey: any;
  loggedInUser : any;

 /* constructor(    
    private _providerAdminAuthService: AdminAuthService,
    private authManageService: AuthManageService,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.authManageService.getLoggedInUser();
    this.currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key');
  }
  */
 constructor(  
  private adminService: AdminService,
  private _providerAdminAuthService: AdminAuthService,
  private authManageService: AuthManageService,
) {}

ngOnInit() {

  this.currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key');
  this.adminService.getAdminInfo().subscribe(
    (res) => {
      this.userDetails = res.user_profile;
       console.log(this.userDetails.user_name);
      localStorage.setItem('adminProfile', JSON.stringify(this.userDetails));
    },
    (err) => {
      console.log('Something went wrong ' + err.message);
    }
  );
}

  ngAfterViewInit(){
    this.getMfaValue();
  }

  handlerinsuranceInformation(answers: any[]) {
    if (!!answers && answers.length > 0) {
      const Insurance = answers.find((x) => x.question_text === 'Insurance');
      const insuranceprovidername = answers.find(
        (x) => x.question_text.trim() === 'Insurance Provider Name'
      );
      const medicalGroupNumber = answers.find(
        (x) => x.question_text === 'Medical Group Number'
      );
      const memberId = answers.find(
        (x) => x.question_text.trim() === 'Medical ID'
      );
      this.insuranceInformation.push(
        Insurance,
        insuranceprovidername,
        medicalGroupNumber,
        memberId
      );
    }
  }

  logOut() {
    window.localStorage.clear();
  }

  linkRecipient() {
    if (!this.userDetails.valid) {
      return;
    }  
  }

  setMfaValue(val) {
    localStorage.setItem('adminProfile', JSON.stringify(this.userDetails));
     this._providerAdminAuthService.saveMfaFlagForVaccinatorSiteAdmin(val.checked).subscribe(
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
         this._providerAdminAuthService.getMfaFlagForVaccinatorSiteAdmin().subscribe(
           (res) => {
             localStorage.setItem('mfaFlag',''+JSON.stringify(res.mfaEnabled));
             this.mfaValue = res.mfaEnabled;
           },
           (err) => {
             console.log('Error : ' + err);
           });
     }
  }

  enableDisableMfaSwitch():boolean {
    if(this.authManageService.getLoggedInUser()?.email_verified 
      && this.authManageService.getLoggedInUser()?.phone_number_verified){
        return true;
      }
     return false;
 }
}
