import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { RecipientAuthService, SuperAdminService } from '../../../../core';
import { COUNTIES } from '../../../../shared/helpers/constant';
import { BulkUpload } from '../../../../core/services/bulkupload.service';
import { debounceTime, filter } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { AdminService } from '../../../../core/services/admin.service';

@UntilDestroy()
@Component({
  selector: 'app-site-editor',
  templateUrl: './site-editor.component.html',
  styleUrls: ['./site-editor.component.scss'],
})
export class SiteEditorComponent implements OnInit {
  formGroup: FormGroup;
  objectId: string;

  counties = COUNTIES;
  states: any[];
  providers: any[];
  public stateshow: boolean = true;
  dialCode: string = '+1';
  show: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _superAdminService: SuperAdminService,
    private countryService: CountriesService,
    private BulkUploadService: BulkUpload,
    private notify: NotificationService,
    private _providerRecipientAuthService: RecipientAuthService,
    private adminService: AdminService,
  ) {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.objectId = params.id;
      }
    });
    this.countryService.allCountries().subscribe(({ Countries }) => {
      const { States } = Countries.find((value) => value.CountryName === 'United States');
      this.states = States.map((state) => state.StateName);
    });
    this.loadProviders();
  }

  get isNew(): boolean {
    return !this.objectId;
  }

  ngOnInit(): void {
    this.isNew ? this.basicForm() : this.editBuildForm();
  }

  basicForm() {
    this.formGroup = this._formBuilder.group({
      siteKey:[''],
      state: [''],
      county: [''],
      provider: [''],
      facility: [''],
      site_name: ['', [Validators.required]],
      address: [''],
      city: [''],
      zipcode: [''],
      phone: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      longitude: ['',[Validators.required]],
      latitude: ['',[Validators.required]],
    });
    this.watchZipChange(this.formGroup)
  }

  editBuildForm() {
    let reqData = {
      id: this.objectId,
    };
    this._superAdminService.getSitesData(reqData).subscribe(
      (res) => {
        this.basicForm();
        this.formGroup.patchValue({
          siteKey : res.alternate_site_key ?res.alternate_site_key :'',
          state: res.state,
          county: res.county,
          site_name: res.site_name,
          address: res.address1,
          city: res.city,
          zipcode: res.zip,
          email: res.email,
          phone: res.phone,
          provider: res.provider_id,
          longitude: parseFloat(res.longitude) || 0,
          latitude: parseFloat(res.latitude) || 0,
        });
        // this.formGroup.controls['phone'].disable();
      },
      (err) => {
        console.log(err);
      },
    );
  }

  loadProviders(): void {
    this.BulkUploadService.getProviderSelect().subscribe((res) => {
      this.providers = res.results;
    });
  }

  save() {
    let formValues = this.formGroup.getRawValue();

    if (!this.formGroup.valid) {
      return;
    }

    let reqObj = {
      alternate_site_key: formValues.siteKey,
      site_name: formValues.site_name,
      address1: formValues.address,
      city: formValues.city,
      state: formValues.state,
      county: formValues.county,
      zip: formValues.zipcode,
      email: formValues.email,
      phone: formValues.phone && this.dialCode + formValues.phone,
      provider_id: formValues.provider,
      longitude: parseFloat(formValues.longitude) || 0,
      latitude: parseFloat(formValues.latitude)||0,
    };

    if (reqObj.longitude && reqObj.latitude) {
      reqObj['geopoint'] = `${reqObj.latitude},${reqObj.longitude}`;
    } else {
      reqObj['geopoint'] = null;
    }

    const call = this.isNew
      ? this._superAdminService.saveSite(reqObj)
      : this._superAdminService.editsaveSite(reqObj, this.objectId);

    call.subscribe((res) => {
      this.notify.showNotification('Sites saved successfully', 'top', 'success');
      this._router.navigate(['/super-admin/sites']);
    });
  }

  onDialCodeChange(event): void {
    this.dialCode = '+' + event.dialCode;
  }
  fetchZipCode(data){

  }
  private watchZipChange(formGroup: FormGroup): void {

    
    formGroup.controls.zipcode.valueChanges
      .pipe(
        // debounceTime(300),
        // filter((value) => value?.length > 4 && value?.length < 11),
        untilDestroyed(this),
      )
      .subscribe((zip) => {
        if(zip.length > 4){
        this.adminService.fetchZipDetails({ zip }).subscribe(({ city, latitude, longitude, state }) => {
          formGroup.patchValue({
            city,
            latitude,
            longitude,
            state: this.countryService.abbrState(state),
          });
        },(err) => {
          this.getError();
        });
      }else{
        this.getError();
      }
      });
  }
  getError(){
    this.formGroup.patchValue({
      city :'',
      latitude :'',
      longitude :'',
      state: '',
    });
  }
}
