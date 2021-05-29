import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipientAuthService } from 'src/app/core';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface ISelectedHolidayList {
  name: string;
  value: string;
}

@Component({
  selector: 'app-site-setting',
  templateUrl: './site-setting.component.html',
  styleUrls: ['./site-setting.component.scss'],
})
export class SiteSettingComponent implements OnInit {
  selectedHolidayList: string[] = [];
  holidayList: ISelectedHolidayList[] = [
    { name: 'Holiday 1', value: 'Holiday1' },
    { name: 'Holiday 2', value: 'Holiday2' },
    { name: 'Holiday 3', value: 'Holiday3' },
    { name: 'Holiday 4', value: 'Holiday4' },
  ];
  siteSettingForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _providerRecipientAuthService: RecipientAuthService,
    private activatedRoute: ActivatedRoute,
    private notify: NotificationService
  ) {}
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.siteSettingForm = this._formBuilder.group({
      paymenAccepted: ['', [Validators.required]],
      SelectHoliday: this._formBuilder.array([]),
      SiteStatus: ['', [Validators.required]],
    });
  }

  siteSettingHandler() {
    if (!this.siteSettingForm.valid) {
      return;
    }
    let newChangedPasswordData = {
      oldPassword: this.siteSettingForm.value.oldPassword,
      newPassword: this.siteSettingForm.value.confirmPassword,
    };
  }

  getSeletedHoliday(selectedHoldayEvent: MatSelectChange, status: boolean) {
    if (status) {
      if (!this.selectedHolidayList.includes(selectedHoldayEvent.value))
        this.selectedHolidayList.push(selectedHoldayEvent.value);
    } else {
      const index = this.selectedHolidayList.findIndex(
        (x) => x === selectedHoldayEvent.value
      );
      this.selectedHolidayList.splice(index, 1);
    }
  }
}
