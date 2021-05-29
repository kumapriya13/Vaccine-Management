import { AuthManageService } from 'src/app/core';
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../../core';

@Component({
  selector: 'app-edit-seat',
  templateUrl: './edit-seat.component.html',
  styleUrls: ['./edit-seat.component.scss'],
})
export class EditSeatComponent implements OnInit {
  seat: any;
  @Input() id: string;
  vaccinatorDelails: any;
  vaccinatorList: any[] = [];
  selectedItems: any[] = [];
  vaccineList: any[] = [];
  public isEdit: boolean = false;
  site_ids: any[] = [];
  editSeatForm: FormGroup;
  seatId: string = '';
  site: any;
  selectedVaccine: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private _location: Location,
    private _route: ActivatedRoute,
    private authManageService: AuthManageService
  ) {
    this.seatId = this._route.snapshot.paramMap.get('id');
  }

  backClicked() {
    this._location.back();
  }

  getVaccinator(id: string) {
    this.siteAdminService.getVaccinatorById(id).subscribe(
      (res) => {
        this.vaccinatorDelails = res;
        // console.log(res);
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

    // this.getSeatData(this.seatId);
  }

  getVaccinatorList(page: number, pageLength: number) {
    this.siteAdminService
      .getVaccinatorList(page, pageLength)
      .subscribe((res) => {
        this.vaccinatorList = res.results;
        this.getSeatData(this.seatId);
        // console.log(this.vaccinatorList[0]);
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
    this.editSeatForm = this._formBuilder.group({
      seatLabel: [null, [Validators.required]],
      // seatNumber: [null],
      vaccineName: [null, [Validators.required]],
      vaccinator: [null, [Validators.required]],
      status: [null, [Validators.required]],
      allocation: [null, [Validators.required]],
    });
  }

  getSeatData(seatId: string) {
    this.siteAdminService.getSeat(seatId).subscribe(
      (res) => {
        //  console.log(res,'---');
        this.site = res;
        console.log(this.site['status'])
        this.editSeatForm.get('seatLabel').setValue(this.site['seat_name']);
        this.editSeatForm
          .get('status')
          .setValue(
            this.site['status'].toLowerCase() == 'active' ||this.site['status'].toLowerCase() =='enable' ? 'Enable' : 'Disable'
          );
        this.editSeatForm
          .get('allocation')
          .setValue(this.site['seat_allocation_type']);
        this.bindVaccine(this.site['vaccine_id']);
        this.bindVaccinatorIds(this.site['vaccinator_ids']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  bindVaccine(vaccine_id: string) {
    console.log(this.vaccinatorList,'---')
    this.selectedVaccine = this.vaccineList.filter(
      (value) => value.id == vaccine_id
    );
    this.selectedVaccine =
      this.selectedVaccine.length > 0 ? this.selectedVaccine[0] : null;
    this.editSeatForm.get('vaccineName').setValue(this.selectedVaccine);
  }

  bindVaccinatorIds(vaccinator_ids: any[]) {
    this.selectedItems = this.vaccinatorList.filter((value: any) => {
      return vaccinator_ids.indexOf(value.id) > -1;
    });

    this.editSeatForm.get('vaccinator').setValue(this.selectedItems);
  }

  editSeatFormSub() {
    let formValues = this.editSeatForm.value;

    if (!this.editSeatForm.valid) {
      return;
    }

    this.site['vaccine_id'] = formValues.vaccineName.id;
    this.site['vaccinator_ids'] = formValues.vaccinator.map(
      (value) => value.id
    );
    this.site['seat_allocation_type'] = formValues.allocation;
    this.site['status'] =
      formValues.status.toLowerCase() == 'enable' ||   formValues.status.toLowerCase() == 'active' ? formValues.status : formValues.status;
    this.site['$expanded'] = {
      vaccine_name: formValues.vaccineName.name,
      vaccinator_names: formValues.vaccinator.map((value) => value.user_name),
    };

    this.siteAdminService.editSeat(this.site).subscribe(
      (res) => {
        this.notify.showNotification(
          'Seat Edited successfully',
          'top',
          'success'
        );
        this._router.navigate(['site-admin/list-seat']);
      },
      (err) =>
        this.notify.showNotification('Something went wrong', 'bottom', 'error')
    );
  }

  removeVaccinator(item) {
    this.selectedItems = this.selectedItems.filter((value: any) => {
      return item.id != value.id;
    });

    this.editSeatForm.get('vaccinator').setValue(this.selectedItems);
  }
  // item

  getMaterialList() {}

  getSingleVacc(vacc: MatSelectChange) {
    if (vacc.value === 'selectAll') {
      return;
    }
    // console.log(vacc);
    this.selectedItems = vacc.value;
  }

  toggleAllSelection(ev: any, allSelectedVaccinator: any[]) {
    if (ev.selected) {
      this.editSeatForm.controls.vaccinator.patchValue(allSelectedVaccinator);
      this.selectedItems = allSelectedVaccinator;
      ev._selected = true;
    } else {
      this.editSeatForm.controls.vaccinator.patchValue([]);
      this.selectedItems = [];
    }
  }
}
