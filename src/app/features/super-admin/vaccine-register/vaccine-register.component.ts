import { Component, OnInit } from '@angular/core';
import { BulkUpload } from '../../../core/services/bulkupload.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { constrcutCustomeError } from 'src/app/shared/helpers/utility-functions';
import { BlockLike } from 'typescript';

@Component({
  selector: 'app-vaccine-register',
  templateUrl: './vaccine-register.component.html',
  styleUrls: ['./vaccine-register.component.scss'],
})
export class VaccineRegisterComponent implements OnInit {
  vaccineSignUpForm: FormGroup;
  vaccineUserSave = true;
  editUserId: string;
  dataeditName:boolean=false;
  dataeditdecs:boolean= false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bulkUploadService: BulkUpload,
    private notificationService: NotificationService
  ) {
    this.route.params.subscribe((params) => {
      // console.log(params)
      if (params.id) {
        this.vaccineUserSave = false;
        this.editUserId = params.id;
      }
    });
  }

  ngOnInit(): void {
    this.vaccineUserSave ? this.buildForm() : this.editBuildForm();
  }

  formsetData(): void {
    this.vaccineSignUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      vaccineManufacturer: ['', [Validators.required]],
      minDosage: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      maxDosage: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      WaitTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      no_of_doses_in_series: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      gaps_in_days_between_doses: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }
  editBuildForm(): void {
    this.formsetData();
    // [{ value: data.user_name, disabled: true }]
    this.bulkUploadService.getVaccineUserId(this.editUserId).subscribe(
      (res) => {
        const data = res;
       this.dataeditName = true
        this.dataeditdecs = data.vaccine_manufacturer ? true : false
        this.vaccineSignUpForm = this.formBuilder.group({
          name: [
            data.name,
          ],
          vaccineManufacturer: [
            data.vaccine_manufacturer ? data.vaccine_manufacturer : ''
          ],
          minDosage: [
            data.min_dosage ? data.min_dosage : '',
            [Validators.required, Validators.pattern('^[0-9]*$')],
          ],
          maxDosage: [
            data.max_dosage ? data.max_dosage : '',
            [Validators.required, Validators.pattern('^[0-9]*$')],
          ],
          WaitTime: [
            data.wait_time ? data.wait_time : '',
            [Validators.required, Validators.pattern('^[0-9]*$')],
          ],
          no_of_doses_in_series: [
            data.no_of_doses_in_series ? data.no_of_doses_in_series : '',
            [Validators.required, Validators.pattern('^[0-9]*$')],
          ],
          gaps_in_days_between_doses: [
            data.gaps_in_days_between_doses
              ? data.gaps_in_days_between_doses
              : '',
            [Validators.required, Validators.pattern('^[0-9]*$')],
          ],
        });
        // this.vaccineDataList = res
      }
    );
  }
  buildForm(): void {
    this.formsetData();
  }

  vaccineSave(): any {
    if (!this.vaccineSignUpForm.valid) {
      return;
    }
    const formData = this.vaccineSignUpForm.value;

    const reqData: any = {
      wait_time: formData.WaitTime,
      max_dosage: formData.maxDosage,
      min_dosage: formData.minDosage,
      name: formData.name,
      vaccine_manufacturer: formData.vaccineManufacturer,
      no_of_doses_in_series: formData.no_of_doses_in_series,
      gaps_in_days_between_doses: formData.gaps_in_days_between_doses,
    };

    if (!this.vaccineUserSave) {
      reqData.id = this.editUserId;
      }

    this.bulkUploadService.vaccineSave(reqData).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/super-admin/vaccine-list']);
      },
      (err) => {
        console.log(err);
        if (err.error.text === '') {
          this.notificationService.showNotification(
            'Something went wrong',
            'top',
            'error'
          );
        }
        /** Fixed the code
         *  Calling custom errro message to get appropirate message
         */
        this.notificationService.showNotification(
          constrcutCustomeError(err),
          'top',
          'error'
        );
      }
    );

    console.log('donesave');
  }
}
