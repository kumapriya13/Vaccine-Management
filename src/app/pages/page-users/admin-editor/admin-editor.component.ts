import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BulkUpload, AdminAuthService, ProviderService } from 'src/app/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
   GENDER_TYPES_FOR_ADD,
  } from '../../../shared/helpers/constant';
  
@Component({
  selector: 'app-admin-editor',
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.scss'],
})
export class AdminEditorComponent implements OnInit {
  formGroup: FormGroup;

  adminUserId: string;
  adminType: string ='';
  dialCode: string = '+1';
  siteList: any[] = [];
  selectedItems: any[] = [];
  sitesSelected = [];

  adminTitleByType = {
    'state-admin': 'State Admin',
    'county-admin': 'County Admin',
    'provider-admin': 'Provider Admin',
    'site-admin': 'Site Admin',
    vaccinator: 'Vaccinator',
    'facility-admin': 'Facility Admin',
    receptionist: 'Receptionist',
  };

  subscription: Subscription;

  providerVisible: boolean;
  siteVisible: boolean;

  providers: any[];
  sites: any[];
  genderData  = GENDER_TYPES_FOR_ADD;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private BulkUploadService: BulkUpload,
    private _notificationService: NotificationService,
    private adminAuthService: AdminAuthService,
    private providerService: ProviderService,
  ) {
    this.route.params.subscribe((params) => {
      this.adminType = params.adminType;
      if (params.id) {
        this.adminUserId = params.id;
      }

      console.log('this.adminType : '+this.adminType);

      switch (this.adminType) {
        case 'receptionist':
        case 'site-admin':
        case 'vaccinator':
          this.providerVisible = true;
          this.siteVisible = true;
          break;
        case 'provider-admin':
          this.providerVisible = true;
          this.siteVisible = false;
          break;
        case 'facility-admin':
          this.providerVisible = true;
      }
    });
  }

  get isNew(): boolean {
    return !this.adminUserId;
  }

  ngOnInit() {
    this.isNew ? this.buildForm() : this.editBuildForm();
    if (this.isNew) {
      this.subscription = this.formGroup.controls['user_name'].valueChanges
        .pipe(debounceTime(300))
        .subscribe((value) => this.checkUsernameUnique());
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  basicForm() {
    const config = {
      user_name: ['', [Validators.required]],
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      gender: [''],
      phoneNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      site : ['', [Validators.required]]
    };
    if (this.providerVisible) {
      config['provider'] = [
        this.adminAuthService.isProviderAdmin() ? this.adminAuthService.getProvider()?.id : null,
        Validators.required,
      ];
      this.loadProviders();
    }
    if (this.siteVisible) {
    //  config['site'] = ['', Validators.required];
      this.loadSites();
    }
    this.formGroup = this._formBuilder.group(config);
    if (this.adminAuthService.isProviderAdmin()) {
      this.formGroup.controls['provider'].disable();
    }
  }

  editBuildForm() {
console.log(1111111)
    this.BulkUploadService.getUserDetailById(this.adminUserId).subscribe((res) => {
      this.basicForm();
      let data = res;
      console.log(data);
      this.formGroup.patchValue({
        user_name: data.user_name,
        fname: data.fname,
        lname: data.lname,
        gender: data.gender,
        email: data.email,
        phoneNo: data.mobile_number,
      });
      if (this.providerVisible) {
        this.formGroup.patchValue({
          provider: data.provider_id,
        });
      }
console.log('=======')
      if (data.site_ids) {
        console.log('=========')
        this.BulkUploadService.getSiteSelect({
          provider_id: data.provider_id,
        }).subscribe((res) => {
          this.sites = res.results;
          this.selectedItems = data.site_ids;

          if(this.adminType=='site-admin'){
                this.formGroup.patchValue({
                  site: data.site_ids[0],
                });
          }else{
              this.formGroup.patchValue({
                site: data.site_ids,
              });
          }
     
        });
        
      }
 
      this.formGroup.controls['user_name'].disable();
      this.formGroup.controls['email'].disable();
      this.formGroup.controls['phoneNo'].disable();
    });
  }

  buildForm() {
    this.basicForm();
  }

  save() {
    if (!this.formGroup.valid) {
      return;
    }
    let formData = this.formGroup.getRawValue();
    let formData2 = this.formGroup.value;
    //console.log("formData raw",formData);
    console.log("formData 2",JSON.stringify(formData2));
    

    let reqData: any = {
      user_name: formData.user_name,
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      mobile_number: this.dialCode + formData.phoneNo,
      dob: '',
      gender: formData.gender,
      address1: '',
      address2: '',
      address3: '',
      state: '',
      zip: '',
      county: '',
      country: '',
    };

    if (this.providerVisible) {
      reqData.provider_id = formData.provider;
    }

    console.log(this.siteVisible)
    if (this.siteVisible) {
      if(this.adminType =='site-admin')
          reqData.site_ids = [formData.site];
      else
          reqData.site_ids = formData.site;

    }


    if (!this.isNew) {
      reqData.id = this.adminUserId;
    }

    this.BulkUploadService.saveAdmin(reqData, this.adminType).subscribe(
      (res) => {
        console.log(res);
        this._router.navigate([this.isNew ? '../../' : '../../../'], { relativeTo: this.route });
      },
      (err) => {
        console.log(err.error);
        if (err.error.message == '') {
          this._notificationService.showNotification('Something went wrong', 'top', 'error');
        }
        this._notificationService.showNotification(err.error.message, 'top', 'error');
      },
    );
  }

  checkUsernameUnique() {
    if (this.formGroup.value.user_name) {
      this.BulkUploadService.CheckUserName(this.formGroup.value.user_name).subscribe(
        (res) => {
          res.result === 'unavailable'
            ? this._notificationService.showNotification('User Name Alreay Exists', 'top', 'error')
            : '';
        },
        (err) => {
          if (err.error.err.message == '') {
            this._notificationService.showNotification('Something went wrong', 'top', 'error');
          }
          this._notificationService.showNotification(err.error.err.message, 'top', 'error');
        },
      );
    }
  }

  onDialCodeChange(event): void {
    this.dialCode = '+' + event.dialCode;
  }

  loadProviders(): void {
    if (this.adminAuthService.isProviderAdmin()) {
      this.providers = [this.adminAuthService.getProvider()];
        this.loadSites(this.providers[0].id)
    } else {
      this.providerService.search('', 1, 20).subscribe((res) => {
        this.providers = res.results;
  });
    }
  }

  loadSites(providerId?): void {
    this.BulkUploadService.getSiteSelect({
      provider_id: providerId,
    }).subscribe((res) => {
      this.sites = res.results;
    });
  }

  siteChanged({ source, value }): void {
    const site = this.sites.find((site) => site.id === value);
    if (site) {
      const provider = this.providers.find((provider) => provider.id === site.provider_id);
      if (provider) {
        this.formGroup.patchValue({ provider: provider.id });
      }
    }
  }

  providerChanged({ source, value }): void {
    this.formGroup.patchValue({ site: null });
    this.loadSites(value);
  }

  toggleAllSelection(ev: any, allSelectedVaccinator: any[]) {
    if (ev.selected) {
      let idsList=[];
      allSelectedVaccinator.forEach(element => {
        idsList.push(element.id);
        this.sitesSelected.push(element);
      });
      this.formGroup.controls.site.patchValue(idsList);
      this.selectedItems = idsList;
      ev._selected = true;
    } else {
      this.formGroup.controls.site.patchValue([]);
      this.selectedItems = [];
      this.sitesSelected = [];
    }
  }

  
  getSingleSite(site: MatSelectChange) {
    if (site.value === 'selectAll') {
      return;
    }
    this.selectedItems = site.value;
    this.sitesSelected.push(site);
   // console.log('Sites selected : '+JSON.stringify(this.sitesSelected))
  }

  removeSite(item) {
    this.sitesSelected = this.sitesSelected.filter((value: any) => {
      return item.id != value.id;
    });
    this.formGroup.get('site').setValue(this.sitesSelected);
  }
}
