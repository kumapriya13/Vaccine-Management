import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-page-tab-vaccinator',
  templateUrl: './page-tab-vaccinator.component.html',
  styleUrls: ['./page-tab-vaccinator.component.scss']
})
export class PageTabVaccinatorComponent implements OnInit {
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
      siteName: ['', [Validators.required]],
      siteAddress: ['', [Validators.required]],
      siteAdmin: ['', [Validators.required]],
      vaccine: ['', [Validators.required]],
      gpsLongitute: ['', [Validators.required]],
      gpsLatitudce: ['', [Validators.required]]
    });
  }

  pagesManageSiteFormSub() {
    if (!this.pagesManageSiteForm.valid) {
      return;
    }
  }
}
