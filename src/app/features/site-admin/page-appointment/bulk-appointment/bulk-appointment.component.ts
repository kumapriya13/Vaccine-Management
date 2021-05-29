import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SiteAdminService, AuthManageService } from 'src/app/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RecipientListInputComponent } from '../recipient-filter/recipient-list-input.component';

@Component({
  selector: 'bulk-appointment',
  templateUrl: './bulk-appointment.component.html',
  styleUrls: ['./bulk-appointment.component.scss'],
})
export class BulkAppointmentComponent implements OnInit {
  @ViewChild(RecipientListInputComponent) recipientList: RecipientListInputComponent;
  selectedVaccine: null;
  appform: FormGroup;
  materialList = [];
  minDate: Date;
  isSubmited: boolean = false;
  isShown: boolean = false;
  selVacinevalue: any;
  isshowtable: boolean = false;
  dirtyForm: boolean = false;
  isFilterClicked: boolean=false;
  constructor(
    private fb: FormBuilder,
    private _siteAdminService: SiteAdminService,
    private _notificationService: NotificationService,
    private authManageService: AuthManageService,
    public dialogRef: MatDialogRef<BulkAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit(): void {
    this.getMaterialListNames();
    this.appform = this.fb.group({
      allocationType: ['', [Validators.required]],
      materialId: ['', [Validators.required]],
      startDateTime: ['', [Validators.required]],
      timeSelected: ['', [Validators.required]],
    });

    let minCurrentDate = new Date();
    this.minDate = minCurrentDate;
  }

  closeTheDialog(action: string): void {
    this.dialogRef.close();
  }

  getMaterialListNames() {
    this._siteAdminService.getMaterialListNames().subscribe((res) => {
      this.materialList = res.results;
    });
  }

  submitData() {

    if (!this.appform.valid) {
      this.appform.markAllAsTouched();
      this._notificationService.showNotification(
        'Please fill the all mandatory fields',
        'bottom',
        'error'
      );
      return;
    }

    this.isSubmited = true;
    let data = this.appform.value;
    let sideIds = [];
    let matIds = [];

    let obj = this.authManageService.getLoggedInUser();
    sideIds.push(obj.site_ids[0]);
    matIds.push(data.materialId);

    let allocationTypeArray = [];
    if (data.allocationType == 'All') {
      allocationTypeArray.push('Private');
      allocationTypeArray.push('Public');
    } else {
      allocationTypeArray.push(data.allocationType);
    }

    let year = data.startDateTime.getFullYear();
    let month: any = data.startDateTime.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let date: any = data.startDateTime.getDate();
    if (date < 10) date = '0' + date;

    let hrMin = this.convertTime12to24(data.timeSelected);

    let startDtTime = String(year + '-' + month + '-' + date + 'T' + hrMin + ':00');
    startDtTime = startDtTime.replace(/\s/g, '');

    let reqObj = {
      siteIds: sideIds,
      materialIds: matIds,
      allocationTypes: allocationTypeArray,
      startDateTime: startDtTime,
      q: this.recipientList.buildRecipientQuery(),
      pageLength: 500,
    };

    this._siteAdminService.bookSelectedAppointments(reqObj).subscribe(
      (res) => {
        let msg = this.countSucessFailure(res);

        if (msg == 0) this._notificationService.showNotification('Slots not available', 'top', 'error');
        else
          this._notificationService.showNotification(
            'Successfully booked for ' + msg + ' recipients.',
            'top',
            'success',
          );

        setTimeout(() => {
          this.dialogRef.close();
        }, 2000);
      },
      (err) => {
        console.log('Error : ' + err);
      },
    );
  }

  countSucessFailure(resp) {
    let sucess_count = 0;
    let failure_count = 0;
    let strMsg = '';
    for (let recep of resp) {
      if (!recep.status.toLowerCase().includes('success')) failure_count = failure_count + 1;
      else sucess_count = sucess_count + 1;
    }
    //return 'Sucessfully booked for '+sucess_count+' recipients.' //, Slots not available for '+failure_count+' receipients.';
    return sucess_count;
  }

  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    if (hours.length == 1) {
      hours = '0' + hours;
    }
    if (minutes.length == 1) {
      minutes = '0' + minutes;
    }
    return `${hours}:${minutes}`;
  }

  selectedVaccineHandler(event) {
    this.selectedVaccine = event.value;
    this.isshowtable = true;
  }

  isFilterHandlerEvent(event: any) {
    console.log('isFilterClick', event)
    this.isFilterClicked = event;
  }
}
