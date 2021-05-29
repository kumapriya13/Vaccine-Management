import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SuperAdminService, BulkUpload, AuthManageService, ProviderService } from 'src/app/core';
import { retriveMenuFromAdminType } from 'src/app/core/routes';
import { COUNTIES } from 'src/app/shared/helpers/constant';
import { constrcutCustomeError } from 'src/app/shared/helpers/utility-functions';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminAuthService } from '../../../core/services/auth/admin-auth.service';
import { RecipientAuthService } from 'src/app/core/services/auth/recipient-auth.service';

@Component({
  selector: 'app-provider-site-new',
  templateUrl: './provider-site-new.component.html',
  styleUrls: ['./provider-site-new.component.scss'],
})
export class ProviderSiteNewComponent implements OnInit, OnDestroy {
  private awake$ = new Subject<void>();
  formGroup: FormGroup = this.fb.group({
    siteKey:[''],
    state: [],
    county: [],
    provider: [],
    facility: [],
    site_name: [null, [Validators.required]],
    address: [],
    city: [],
    zipcode: [],
    phone: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: [
      '',
      [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')],
    ],
    longitude: [null, [Validators.pattern('-?\\d+\\.?\\d*')]],
    latitude: [null, [Validators.pattern('-?\\d+\\.?\\d*')]],
  });

  objectId: string;

  counties = COUNTIES;
  states: any[];
  providers: any[];

  dialCode: string = '+1';
  loggedInUser: any;

  get isNew(): boolean {
    return !this.objectId;
  }

  get controls(): any {
    return this.formGroup.controls;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private superAdminService: SuperAdminService,
    private countryService: CountriesService,
    private notify: NotificationService,
    private authManageService: AuthManageService,
    private adminAuthService: AdminAuthService,
    private _providerRecipientAuthService: RecipientAuthService,

  ) {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.objectId = params.id;
      }
    });
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.fetchSiteById(this.objectId);
    } else {
      this.getProviderDisable();
    }
    this.fetchCountries();
    this.providers = [this.adminAuthService.getProvider()];
  }

  getProviderDisable = () => {
    this.loggedInUser = this.authManageService.getLoggedInUser();

    this.formGroup.patchValue({
      provider: this.loggedInUser.provider.id
    });
    (this.controls.provider as AbstractControl).disable();
  }

  fetchCountries = () => {
    this.countryService
      .allCountries()
      .pipe(takeUntil(this.awake$))
      .subscribe(
        ({ Countries }) => {
          const { States } = Countries.find(
            (value) => value.CountryName === 'United States'
          );
          this.states = States.map((state) => state.StateName);
        },
        (err) =>
          this.notify.showNotification(
            constrcutCustomeError(err),
            'top',
            'error'
          )
      );
  };

  fetchSiteById = (siteId: string) => {
    this.superAdminService
      .getSitesData({ id: siteId })
      .pipe(takeUntil(this.awake$))
      .subscribe(
        (res) => {
          this.patchForm(res);
        },
        (err) =>
          this.notify.showNotification(
            constrcutCustomeError(err),
            'top',
            'error'
          )
      );
  };

  patchForm = (data: any): void => {
    this.formGroup.patchValue({
      siteKey : data.alternate_site_key ?data.alternate_site_key :'',
      state: data.state,
      county: data.county,
      site_name: data.site_name,
      address: data.address1,
      city: data.city,
      zipcode: data.zip,
      email: data.email,
      phone: data.phone,
      provider: data.provider_id,
      longitude: parseFloat(data.longitude) || 0,
      latitude: parseFloat(data.latitude) || 0,
    });
    (this.controls.phone as AbstractControl).disable();
    (this.controls.provider as AbstractControl).disable();
  };

  onDialCodeChange = (event): void => {
    this.dialCode = '+' + event.dialCode;
  };

  save = () => {
    const values = this.formGroup.getRawValue();
    if (!this.formGroup.valid) {
      return;
    }
    let location = {
     long: parseFloat(values.longitude) || 0,
      lat : parseFloat(values.latitude)|| 0
    }
    const reqObj = {
      alternate_site_key: values.siteKey,
      site_name: values.site_name,
      address1: values.address,
      city: values.city,
      state: values.state,
      county: values.county,
      zip: values.zipcode,
      email: values.email,
      phone: values.phone && this.dialCode + values.phone,
      provider_id: values.provider,
      longitude:location.long,
      latitude:location.lat,
      geopoint:
        values.longitude && values.latitude
          ? `${location.lat},${location.long}`
          : null,
    };

    const call = this.isNew
      ? this.superAdminService.saveSite(reqObj)
      : this.superAdminService.editsaveSite(reqObj, this.objectId);

    call.pipe(takeUntil(this.awake$)).subscribe(
      (res) => {
        this.notify.showNotification(
          'Sites saved successfully',
          'top',
          'success'
        );
        this.router.navigate(['/provider/site']);
      },
      (err) =>
        this.notify.showNotification(constrcutCustomeError(err), 'top', 'error')
    );
  };
  fetchZipCode(data){
    if(data.value.length > 4){

      let zip = {
        zip: data.value,
      };
  
      this._providerRecipientAuthService.fetchdetails(zip).subscribe(
        (res) => {
          this.formGroup.controls.city.setValue(res.city);
          this.formGroup.controls.latitude.setValue(res.latitude);
          this.formGroup.controls.longitude.setValue(res.longitude);
        },
        (err) => {
          this.getError();
          this.notify.showNotification("Invalid Zip Code","top",'error')
          //alert(err)
        }
      );
            
    }else{
      this.getError()
    } 
   }
   getError(){
    this.formGroup.controls.city.setValue('');
    this.formGroup.controls.latitude.setValue('');
    this.formGroup.controls.longitude.setValue('');
   }
  ngOnDestroy(): void {
    this.awake$.next();
    this.awake$.complete();
  }
}
