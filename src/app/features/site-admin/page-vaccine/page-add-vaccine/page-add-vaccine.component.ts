import { AuthManageService } from 'src/app/core';
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SiteAdminService } from '../../../../core';
import { VACCINE_COLORS } from 'src/app/shared/helpers/constant';

@Component({
  selector: 'app-page-add-vaccine',
  templateUrl: './page-add-vaccine.component.html',
  styleUrls: ['./page-add-vaccine.component.scss'],
})
export class PageAddVaccineComponent implements OnInit {
  materialListNames: [];
  statusList: any = [
    { name: 'Enable', value: 'Enable' },
    { name: 'Disable', value: 'Disable' },
  ];
  site_ids: any[];
  vaccine: any;
  addVaccineForm: FormGroup;
  quantityVialsValue: number = 0;
  dosevialvalue: number = 0;
  extraDoseValue: number = 0;

  statusFlag: boolean = false;
  cSelected:string='';

  materialColorList = VACCINE_COLORS;

  @ViewChildren('children') children: QueryList<NgModel>;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private _location: Location,
    private authManageService: AuthManageService,
    public datepipe: DatePipe
  ) { }
  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {
    this.getMaterialListNames();
    this.buildForm();
    this.site_ids = this.authManageService.getLoggedInUser()['site_ids'];
  }

  buildForm() {
    this.addVaccineForm = this._formBuilder.group({
      vaccineName: ['', [Validators.required]],
      batchNumber: ['', [Validators.required]],
      quantityVials: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      dosevial: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      extraDoses: ['', [Validators.pattern('^[0-9]*$')]],
      // donenumber :[this.quantityVialsValue],
      recievedDate: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      status: ['Enable', [Validators.required]],
    });
  }
  quantityVialsno(data) {
    this.quantityVialsValue = data.target.value;
  }
  dosevialno(data) {
    this.dosevialvalue = data.target.value;
  }
  extraDoseno(data) {
    this.extraDoseValue = data.target.value;
  }

  getMaterialListNames() {
    this._siteAdminService.getMaterialListNames().subscribe((res) => {
      this.materialListNames = res.results;
    });
  }


  addVaccineFormSub() {

    if(this.cSelected==''){
      this.notify.showNotification('Select Colour for Lot Number.','top','error');
      return;
    }

    let formValues = this.addVaccineForm.value;
    if (!this.addVaccineForm.valid) {
      return;
    }


    let recievedDate = this.datepipe.transform(
      formValues.recievedDate,
      'yyyy-MM-dd'
    );
    let expiryDate = this.datepipe.transform(
      formValues.expiryDate,
      'yyyy-MM-dd'
    );
    // if(recievedDate>expiryDate){
    //   this.notify.showNotification(
    //     'Recevied date must be less than expiry date',
    //     'top',
    //     'error'
    //   );
    //   return false;
    // }
    if (expiryDate < recievedDate) {
      this.notify.showNotification(
        'Expiry date must be greater or equal to recevied date',
        'top',
        'error'
      );
      return false;
    }

    let reqObj = {
      batch_no: formValues.batchNumber,
      site_id: this.site_ids[0],
      status: formValues.status,
      expected_availability_date: recievedDate,
      received_date: recievedDate,
      expiry_date: expiryDate,
      no_of_vials: parseInt(formValues.quantityVials),
      no_of_doses_in_batch: Number(this.quantityVialsValue * this.dosevialvalue) + Number(this.extraDoseValue),
      material_name: formValues.vaccineName.name,
      material_description: formValues.vaccineName.description,
      material_no_of_doses_in_series:
        formValues.vaccineName.no_of_doses_in_series,
      material_gaps_in_days_between_doses: formValues.vaccineName
        .gaps_in_days_between_doses
        ? formValues.vaccineName.gaps_in_days_between_doses
        : 0,
      material_no_of_doses_per_vial: parseInt(formValues.dosevial),
      material_type: formValues.vaccineName.type,
      extraDoses: parseInt(formValues.extraDoses),
      material_id: formValues.vaccineName.id,
      doses_consumed: 0,
      material_color:this.cSelected
    };

    console.log(reqObj);

    this._siteAdminService.addMaterial(reqObj).subscribe((res) => {
      this.notify.showNotification(
        'Vaccine added successfully',
        'top',
        'success'
      );
      this._router.navigate(['/site-admin/list-vaccine']);
    });
  }

  enableDisableAction(event: any) {
    console.log('event', event.target.checked);
    if (event.target.checked === true) {
      this.addVaccineForm.get('status').setValue('Enable');
    } else {
      this.addVaccineForm.get('status').setValue('Disable');
    }
  }

  convertToInt(value: any) {
    let number: number = parseInt(value);
    if (isNaN(number))
      return 0;
    else
      return number;
  }

  colorSelected(colour, event) {
    if (event.srcElement.classList[0] === "checked") {
      return;
    }
    let childrenArr: any[] = this.children.toArray();
    for (let obj of childrenArr) {
      obj.nativeElement.className = "";
      setTimeout(obj.nativeElement.classList.add("unchecked"), 0);
    }
    this.cSelected = colour;
    console.log('Selected Colour : ' + colour);
    event.srcElement.classList.remove("unchecked");
    setTimeout(event.srcElement.classList.add("checked"), 0);
  }
}
