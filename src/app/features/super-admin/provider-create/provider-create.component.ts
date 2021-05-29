import { Component, OnInit } from '@angular/core';
import { BulkUpload } from '../../../core/services/bulkupload.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate } from '@angular/common';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { filter, debounceTime } from 'rxjs/operators';
import { constrcutCustomeError } from 'src/app/shared/helpers/utility-functions';
import { COUNTIES } from 'src/app/shared/helpers/constant';
import { CountriesService } from '../../../shared/services/countries.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AdminService } from '../../../core/services/admin.service';

@UntilDestroy()
@Component({
  selector: 'app-provider-create',
  templateUrl: './provider-create.component.html',
  styleUrls: ['./provider-create.component.scss'],
})
export class ProviderCreateComponent implements OnInit {
  providerSignForm: FormGroup;
  providerUserSave = true;
  editUserId: string;
  dialCode: string = '+1';
  [x: string]: any;
  stateInfo: any[];
  countyAd = COUNTIES;

  editValue = {} as any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bulkUploadService: BulkUpload,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private countryService: CountriesService,
  ) {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.providerUserSave = false;
        this.editUserId = params.id;
      }
    });
    this.countryService.getStates().subscribe((stateNames) => {
      this.stateInfo = stateNames;
      console.log(stateNames);
    });
  }

  ngOnInit(): void {
    this.providerUserSave ? this.buildForm() : this.editBuildForm();
  }

  getFormbind(): void {
    this.providerSignForm = this.formBuilder.group({
      state: [''],
      county: [''],
      providerName: ['', [Validators.required]],
      address1: [''],
      city: [''],
      latitude: [''],
      longitude: [''],
      zip: [''], // [Validators.required, Validators.pattern("^[0-9]{5,8}$")]
      phoneNo: [''], // [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['',[Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    });
    this.watchZipChange(this.providerSignForm);
  }

  buildForm(): void {
    this.getFormbind();
  }

  editBuildForm(): void {
    this.getFormbind();

    this.bulkUploadService.getVaccineUserId(this.editUserId).subscribe((res) => {
      const data = res;
      this.editValue = {
        providerName: data.provider_name,
        phoneNo: data.mobile_no,
        email: data.email,
      };
      let location = {
        lat :parseFloat(data.latitude) || 0,
        long :parseFloat(data.longitude) || 0

      }
      this.providerSignForm = this.formBuilder.group({
        state: [data.state],
        county: [data.county],
        providerName: [
          {
            value: data.provider_name,
            disabled: true,
          },
        ],
        address1: [data.address1],
        phoneNo: [
          {
            value: data.mobile_no,
            disabled: true,
          },
        ],
        email: [
          {
            value: data.email,
            disabled: true,
          },
        ],
        city: [data.city],
        latitude: [location.lat],
        longitude: [location.long],
        zip: [data.zip],
      });
      this.watchZipChange(this.providerSignForm);
    });
  }

  onCountryChange(event): void {
    this.dialCode = '+' + event.dialCode;
    this.iso2 = event.iso2;
  }

  providerSave(): void {
    if (!this.providerSignForm.valid) {
      return;
    }
    const formData = this.providerSignForm.value;

    const reqData: any = {
      provider_name: formData.providerName,
      provider_description: formData.provider_description ? formData.provider_description : '',
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      geopoint: '39.7485,-89.606',
      mobile_no: formData.phoneNo ? this.dialCode + formData.phoneNo : '',
      address1: formData.address1 ? formData.address1 : '',
      address2: formData.address2 ? formData.address2 : '',
      address3: formData.address2 ? formData.address2 : '',
      city: formData.city ? formData.city : '',
      state: formData.state ? formData.state : '',
      county: formData.county ? formData.county : '',
      country: formData.country ? formData.country : '',
      zip: formData.zip ? formData.zip : '',
      email: formData.email ? formData.email : '',
    };
    if (!this.providerUserSave) {
      reqData.id = this.editUserId;
      reqData.provider_name = this.editValue.providerName;
      reqData.mobile_no = this.editValue.phoneNo;
      reqData.email = this.editValue.email;
    }

    this.bulkUploadService.providerSave(reqData).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/super-admin/provider-list']);
      },
      (err) => {
        console.log(err.error);
        if (err.error.text === '') {
          this.notificationService.showNotification('Something went wrong', 'top', 'error');
        }
        this.notificationService.showNotification(constrcutCustomeError(err), 'top', 'error');
      },
    );
  }

  private watchZipChange(formGroup: FormGroup): void {
    formGroup.controls.zip.valueChanges
      .pipe(
        debounceTime(300),
        filter((value) => value?.length > 4 && value?.length < 11),
        untilDestroyed(this),
      )
      .subscribe((zip) => {
        this.adminService.fetchZipDetails({ zip }).subscribe(({ city, latitude, longitude, state }) => {
          formGroup.patchValue({
            city,
            latitude,
            longitude,
            state: this.countryService.abbrState(state),
          });
        });
      });
  }
}
