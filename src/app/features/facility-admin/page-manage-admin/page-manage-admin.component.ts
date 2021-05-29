import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-page-manage-admin',
  templateUrl: './page-manage-admin.component.html',
  styleUrls: ['./page-manage-admin.component.scss']
})
export class PageManageAdminComponent implements OnInit {

  passwordToggler: boolean;
  returnUrl: string;
  pagesManageSiteForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    // this._providerRecipientAuthService.navToDashboradIfAuthenticated();
  }

  ngOnInit(): void {
    this.buildFeatureAdminForm();

    this.passwordToggler = false;
  }

  passwordTogglerFun() {
    this.passwordToggler = !this.passwordToggler;
  }

  buildFeatureAdminForm() {
    this.pagesManageSiteForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern(
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
      )]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required]],
    });
  }

  //Getting Ref of Form Member

  get firstName() { return this.pagesManageSiteForm.get('firstName'); }
  get lastName() { return this.pagesManageSiteForm.get('lastName'); }
  get dob() { return this.pagesManageSiteForm.get('dob'); }
  get gender() { return this.pagesManageSiteForm.get('gender'); }
  get email() { return this.pagesManageSiteForm.get('email'); }
  get phone() { return this.pagesManageSiteForm.get('phone'); }
  get address() { return this.pagesManageSiteForm.get('address'); }
  get city() { return this.pagesManageSiteForm.get('city'); }
  get zip() { return this.pagesManageSiteForm.get('zip'); }


  pagesManageSiteFormSub() {
    if (!this.pagesManageSiteForm.valid) {
      return;
    }
  }
}
