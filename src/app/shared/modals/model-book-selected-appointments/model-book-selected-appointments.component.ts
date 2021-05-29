import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SiteAdminService, AuthManageService } from 'src/app/core';
import * as moment from 'moment';
import { NotificationService } from '../../services/notification.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-model-book-selected-appointments',
  templateUrl: './model-book-selected-appointments.component.html',
  styleUrls: ['./model-book-selected-appointments.component.scss']
})

export class ModelBookSelectedAppointmentsComponent implements OnInit {
  appform: FormGroup;
  materialList = [];
  receipientIdsList:any = [];
  hide: boolean = true;
  minDate: Date;
  maxDate: Date;
  isSubmited: boolean=false;
  selectedSiteId: string = "";
  providerSiteAdmin: string = '';
  dateSlot: any;
  siteId: any;
  serviceSubscription: Subscription[] = [];
  checkSlot: any;
  materialId: string = '';
  selectedDate = new Date();
  adminType: any;
  sites: any;
  belowage18: boolean = false;
  receipientIdsListCount: number = 0;
  MaterialIdName: any;
  belowage18Message: string;

  constructor(
    private fb: FormBuilder,
    private _siteAdminService: SiteAdminService,
    private _notificationService: NotificationService,
    private authManageService: AuthManageService,
    public dialogRef: MatDialogRef<ModelBookSelectedAppointmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _spinner: SpinnerService,
    private notify: NotificationService,
  ) { 
    this.adminType = this.authManageService.getLoggedInUser();
    
  }

  ngOnInit(): void {
    this.sites = this.authManageService.getLoggedInUser()?.sites;
    if (!localStorage.getItem('selectedSiteId')) {
      localStorage.setItem('selectedSiteId', this.sites[0].site_id);
    }
    this.selectedSiteId = localStorage.getItem('selectedSiteId');

    this.receipientIdsList = this.dialogData.selectedList;
    console.log("receipientIdsList",this.receipientIdsList);
    this.getMaterialListNames();
    
    this.appform = this.fb.group({
      allocationType: ['', [Validators.required]],
      materialId: ['', [Validators.required]],
      startDateTime: ['', [Validators.required]],
      timeSelected: ['', [Validators.required]],
      siteIds:[this.selectedSiteId,[Validators.required]]
    })
  


    let minCurrentDate = new Date();
    this.minDate = minCurrentDate;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeTheDialog(action: string): void {
    this.dialogRef.close();
  }

  getMaterialListNames() {
    this._siteAdminService.getMaterialListNames().subscribe(
      (res) => {
        this.materialList = res.results;
      }
    );
  }

  submitData() {
    this.isSubmited= true;
    //console.log('Bulk Appointment Form Values : '+this.appform.value);
    let data = this.appform.value;
    let sideIds = [];  let matIds = [];

    let obj = this.authManageService.getLoggedInUser();
    if(this.appform.controls.hasOwnProperty('siteIds') && this.appform.get('siteIds').value !=""){
      sideIds.push(this.appform.get('siteIds').value);
    } else {
      sideIds.push(obj.site_ids[0]);
    }
    //sideIds.push(obj.site_ids[0]);
    matIds.push(data.materialId);

    let allocationTypeArray = [];
    if (data.allocationType == 'All') {
      allocationTypeArray.push('Private'); allocationTypeArray.push('Public');
    } else {
      allocationTypeArray.push(data.allocationType)
    }

    let year = data.startDateTime.getFullYear();
    let month: any = data.startDateTime.getMonth() + 1;
     if(month<10)
        month = '0'+month;
    let date: any = data.startDateTime.getDate();
    if(date<10)
        date = '0'+date;
                
    let hrMin = this.convertTime12to24(data.timeSelected);   
    
    let startDtTime = String(year + '-' + month + '-' + date +'T'+hrMin+':00');
    startDtTime = startDtTime.replace(/\s/g, '');
     let receipientIdsList = []
     this.receipientIdsList.forEach(element => {
       if(!element.hasOwnProperty('ageBelow18')){
        receipientIdsList.push(element.id);
       }
      
    });

    let reqObj = {
      siteIds: sideIds,
      recipientIds: receipientIdsList,
      materialIds: matIds,
      allocationTypes: allocationTypeArray,
      startDateTime: startDtTime
    };

//console.log("receipientIdsList",reqObj,obj.site_ids)
//return;

     this._siteAdminService.bookSelectedAppointments(reqObj).subscribe(
       (res) => {
       //  console.log(res);
         let msg = this.countSucessFailure(res);
         this.receipientIdsList=[];

         if(msg==0)
              this._notificationService.showNotification('Slots not available', "top", 'error');
         else
              this._notificationService.showNotification('Sucessfully booked for '+msg+' recipients.', "top", 'success');

            setTimeout(() => {
               this.dialogRef.close();             
           }, 2000);
       },err => {
                this.receipientIdsList=[];
                console.log('Error : '+err);
          }
     );
  }

  countSucessFailure(resp){
    let sucess_count=0; let failure_count=0;  let strMsg='';
     for(let recep of resp){
       if(!(recep.status.toLowerCase()).includes('success'))
          failure_count = failure_count +1;
       else
          sucess_count =  sucess_count +1;
     }
     //return 'Sucessfully booked for '+sucess_count+' recipients.' //, Slots not available for '+failure_count+' receipients.';
      return sucess_count;
  }

  
  convertTime12to24(time12h){
    const [time, modifier] = time12h.split(' ');  
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }  
    if(hours.length==1){
      hours = '0'+hours;
    } 
    if(minutes.length==1){
      minutes = '0'+minutes;
    }
    return `${hours}:${minutes}`;
  }

  getSelectedSiteName(event) {
    localStorage.setItem('selectedSiteId', event.value);
    this.selectedSiteId = event.value;

    this.providerSiteAdmin = event.value;
    this.dateSlot = null;
    //this.checkSlotAppioment(this.minDate, { siteId: this.selectedSiteId });
    //this.getSlotList()
  }

  checkSlotAppioment(date: Date, obj) {
    this.siteId = obj.siteId ? obj.siteId : this.authManageService.getLoggedInUser()['site_ids'][0];

    if (!this.siteId) return;
    let reqObj = {
      siteId: this.siteId,
      yearMonth: moment(date).format('YYYY-MM'),
    };

    this._spinner.showLoader();
    this.serviceSubscription.push(this._siteAdminService.checkSlotDate(reqObj).subscribe(
      (res) => {
        this._spinner.hideLoader();
        this.checkSlot = res;

        if (this.materialId) {
          this.selectedDate = this.selectedDate || this.minDate;
          //this.getSlotList();
        }
      },
      (err) => {
        this._spinner.hideLoader();
        console.log(err);
      }
    ));
  }

  getSlotList(data) {
    
    this.MaterialIdName = this.materialList.filter((d) => d.id==data.value)[0];
    console.log("selected",this.MaterialIdName);
    this.belowage18 = false;
    if (this.appform.get('materialId').value == '') {
      this.notify.showNotification('select vaccine', 'top', 'error');
      return;
    }
    //console.log("this.materialId",this.appform.get('materialId').value); return ;
    if(this.appform.get('materialId').value !="18756daa-e635-4609-bf06-e14c7a6f2a6b"){
      let today = new Date();
      this.receipientIdsList.forEach((recepient: any) => {
        let birthDate = new Date(recepient.dobdate);
        let age:number = today.getFullYear() - birthDate.getFullYear();
        console.log("receipientIdsList",age,today.getFullYear(),birthDate.getFullYear())
        if (age < 18) {
          this.belowage18 = true;
          recepient.ageBelow18 = true;
        } else {
          recepient.hasOwnProperty('ageBelow18') ? delete recepient.ageBelow18 : '';
        }
      })
        //console.log(this.siteId);
    } else {
      this.receipientIdsList.forEach((recepient: any) => {
        recepient.hasOwnProperty('ageBelow18') ? delete recepient.ageBelow18 : '';
      })
    }
    this.receipientIdsListCount = 0;
      this.receipientIdsList.forEach(d => {
        if(!d.hasOwnProperty('ageBelow18')){
          this.receipientIdsListCount++;
        };
      });
 
      //message for age validation
     if(this.receipientIdsList.length > 0){
       if(this.receipientIdsList.length == 1){
         if(this.receipientIdsList.length-this.receipientIdsListCount){
          this.belowage18Message = `not eligible to be booked for ${this.MaterialIdName.name}`;
         }
       } else if(this.receipientIdsList.length > 1){
         let count = this.receipientIdsList.length-this.receipientIdsListCount;
         //alert(count)
        if(count > 0){
          let countms = (count==this.receipientIdsList.length) ? 'all are' : count > 1 ? count+' are' : count==1 ? count+' is' : '';
         this.belowage18Message = `Out of ${this.receipientIdsList.length} Recipient, ${countms} not eligible to be booked for ${this.MaterialIdName.name}`;
        }
      }
      
     }
      
    console.log("receipientIdsList 123",JSON.stringify(this.receipientIdsList),this.receipientIdsListCount)
  }
  
}
