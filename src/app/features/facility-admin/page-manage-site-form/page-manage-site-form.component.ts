import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-manage-site-form',
  templateUrl: './page-manage-site-form.component.html',
  styleUrls: ['./page-manage-site-form.component.scss']
})
export class PageManageSiteFormComponent implements OnInit {
  returnUrl: string;
  pagesManageSiteForm: FormGroup;
  editTogglerBtns: any = 3;
  tableDataList = [1, 4, 6, 2];

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.buildFeatureAdminForm();
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

  editBtnToggler(value: any) {
    this.editTogglerBtns = value;
  }
}