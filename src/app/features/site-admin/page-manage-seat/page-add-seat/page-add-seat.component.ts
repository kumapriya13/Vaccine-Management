import { AuthManageService } from 'src/app/core';
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../../core';

@Component({
  selector: 'app-page-add-seat',
  templateUrl: './page-add-seat.component.html',
  styleUrls: ['./page-add-seat.component.scss'],
})
export class PageAddSeatComponent implements OnInit {
  @Input() seat: any;
  @Input() id: string;
  vaccinatorDelails: any;
  vaccinatorList: any[] = [];
  selectedItems: any[] = [];
  vaccineList: any[] = [];
  public isEdit: boolean = false;
  site_ids: any[] = [];
  addSeatForm: FormGroup;
  todos=[1,2,3,4,5,6]
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private _location: Location,
    private authManageService: AuthManageService
  ) {}
  backClicked() {
    this._location.back();
  }
  getVaccinator(id: string) {
    this.siteAdminService.getVaccinatorById(id).subscribe(
      (res) => {
        this.vaccinatorDelails = res;
        console.log(res);
      },
      (err) =>
        this.notify.showNotification('Something went wrong', 'bottom', 'error')
    );
  }

  ngOnInit(): void {
    this.isEdit = true;
    let loggedinUser: any = JSON.parse(
      window.localStorage.getItem('loggedinUser')
    );
    this.site_ids = loggedinUser.site_ids;
    this.getVaccinatorList(0, 100);
    this.getMaterialListNames();
    this.buildForm();

    let userLoginObj = this.authManageService.getLoggedInUser();
    let user_id = userLoginObj.user_id;
    this.getVaccinator(user_id);
  }

  getVaccinatorList(page: number, pageLength: number) {
    this.siteAdminService
      .getVaccinatorList(page, pageLength)
      .subscribe((res) => {
        this.vaccinatorList = res.results;
        console.log(this.vaccinatorList[0]);
      });
  }

  getMaterialListNames() {
    this.siteAdminService.getMaterialListNames().subscribe(
      (res) => {
        this.vaccineList = res.results;
      },
      (err) =>
        this.notify.showNotification('something went wrong', 'bottom', 'error')
    );
  }

  buildForm() {
    this.addSeatForm = this._formBuilder.group({
      seatLabel: [
        this.seat ? this.seat.$expanded.seatLabel : null,
        [Validators.required],
      ],
      seatNumber: [
        this.seat ? Number(this.seat.$expanded.seatNumber) : 0,
        [Validators.required],
      ],
      vaccineName: [
        this.seat ? this.seat.$expanded.vaccine_name : null,
        [Validators.required],
      ],
      vaccinator: [
        this.seat ? this.seat.$expanded.vaccinator_name : null,
        [Validators.required],
      ],
      status: [
        this.seat ? this.seat.$expanded.status : null,
        [Validators.required],
      ],
      allocation: [
        this.seat ? this.seat.$expanded.allocation : null,
        [Validators.required],
      ],
    });

    if (this.seat != null) this.addSeatForm.controls['seatNumber'].disable();
  }

  addSeatFormSub() {
    let formValues = this.addSeatForm.value;

    if (!this.addSeatForm.valid) {
      return;
    }

    if(Number(formValues.seatNumber) ==0){
      this.notify.showNotification('Enter valid number of seats.', 'top', 'error');
      return;
    }

    let reqObj = {
      applyToAllSeats: true,
      siteId: this.site_ids[0] || null,
      seatLabel: formValues.seatLabel,
      additionalNoOfSeats: Number(formValues.seatNumber),
      materialId: formValues.vaccineName.id,
      vaccinatorIds: formValues.vaccinator.map((value) => value.id),
      status:
        formValues.status,
      allocationType: formValues.allocation,
    };

    this.siteAdminService.saveSeat(reqObj).subscribe(
      (res) => {
        this.notify.showNotification(
          'Seat added successfully',
          'top',
          'success'
        );
        this._router.navigate(['site-admin/list-seat']);
      },
      (err) =>
        this.notify.showNotification('Something went wrong', 'bottom', 'error')
    );
  }

  getMaterialList() {}

  removeVaccinator(item) {
    this.selectedItems = this.selectedItems.filter((value: any) => {
      return item.id != value.id;
    });

    this.addSeatForm.get('vaccinator').setValue(this.selectedItems);
  }

  getSingleVacc(vacc: MatSelectChange) {
    if (vacc.value === 'selectAll') {
      return;
    }
    this.selectedItems = vacc.value;
    console.log(this.selectedItems)
  }

  toggleAllSelection(ev: any, allSelectedVaccinator: any[]) {
    if (ev.selected) {
      this.addSeatForm.controls.vaccinator.patchValue(allSelectedVaccinator);
      this.selectedItems = allSelectedVaccinator;
      ev._selected = true;
    } else {
      this.addSeatForm.controls.vaccinator.patchValue([]);
      this.selectedItems = [];
    }
  }
}
