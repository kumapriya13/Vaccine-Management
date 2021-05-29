import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SiteAdminService } from '../../../../core';
import { AuthManageService } from 'src/app/core';
import { QueryList } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ViewChildren } from '@angular/core';
import { VACCINE_COLORS } from 'src/app/shared/helpers/constant';

@Component({
  selector: 'app-page-edit-vaccine',
  templateUrl: './page-edit-vaccine.component.html',
  styleUrls: ['./page-edit-vaccine.component.scss'],
})
export class PageEditVaccineComponent implements OnInit {
  site_ids: any[];
  vaccineId: string;
  vaccineItem: any;
  editVaccineForm: FormGroup;
  materialListNames: [];
  selectedvaccine: any;
  quantityVialsValue: number = 0;
  dosevialvalue: number = 0;
  extraDoseValue: number = 0;
  statusList: any = [
    { name: 'Enable', value: 'Enable' },
    { name: 'Disable', value: 'Disable' },
  ];
  currntdate: any;
  exp: any;
  cSelected: string = '';

  materialColorList = VACCINE_COLORS;

  @ViewChildren('children') children: QueryList<NgModel>;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private _siteAdminService: SiteAdminService,
    private _location: Location,
    private notify: NotificationService,
    public datepipe: DatePipe,
    private authManageService: AuthManageService
  ) {}
  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {
    this.site_ids = this.authManageService.getLoggedInUser()?.site_ids;
    this.vaccineId = this.activatedRoute.snapshot.params['id'];
    this.getMaterialListNames();
    this.getVaccine();
    //this.buildForm();
    let d = new Date().getDate();
    let m = new Date().getMonth() + 1;
    let y = new Date().getFullYear();
    //alert(m+'-'+d+'-'+y)
    let dd = new Date().setHours(0, 0, 0, 0);
    this.currntdate = new Date(dd).getTime();
    //this.currntdate = moment(new Date()).format('MM-DD-YYYY').valueOf()
  }

  GetChangeData(data) {
    this.selectedvaccine = data;
  }

  getMaterialListNames() {
    this._siteAdminService.getMaterialListNames().subscribe((res) => {
      this.materialListNames = res.results;
    });
  }

  getVaccine() {
    let reqData = {
      id: this.vaccineId,
    };
    this._siteAdminService.getMaterial(reqData).subscribe((res) => {
      this.vaccineItem = res;
      console.log('this.vaccineItem', this.vaccineItem);
      //this.exp= new Date(this.vaccineItem.expiry_date).getTime();
      let dd = new Date(this.vaccineItem.expiry_date).setHours(0, 0, 0, 0);
      this.exp = new Date(dd).getTime();

      this.selectedvaccine = {
        name: this.vaccineItem.material_name
          ? this.vaccineItem.material_name
          : '',
        description: this.vaccineItem.material_description
          ? this.vaccineItem.material_description
          : '',
        no_of_doses_in_series: this.vaccineItem.material_no_of_doses_in_series
          ? this.vaccineItem.material_no_of_doses_in_series
          : '',
        gaps_in_days_between_doses: this.vaccineItem
          .material_gaps_in_days_between_doses
          ? this.vaccineItem.material_gaps_in_days_between_doses
          : 0,
        type: this.vaccineItem.material_type
          ? this.vaccineItem.material_type
          : '',
        id: this.vaccineItem.material_id ? this.vaccineItem.material_id : '',
      };
      this.quantityVialsValue = this.vaccineItem.no_of_vials
        ? parseInt(this.vaccineItem.no_of_vials)
        : 0;
      this.dosevialvalue = this.vaccineItem.material_no_of_doses_per_vial
        ? parseInt(this.vaccineItem.material_no_of_doses_per_vial)
        : 0;
      this.buildForm();
    });
  }

  buildForm() {
    this.editVaccineForm = this._formBuilder.group({
      vaccineName: [this.vaccineItem.material_id],
      batchNumber: [this.vaccineItem.batch_no, [Validators.required]],
      quantityVials: [
        this.vaccineItem.no_of_vials,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      recievedDate: [moment(this.vaccineItem.received_date).toDate(), [Validators.required]],
      expiryDate: [moment(this.vaccineItem.expiry_date).toDate(), [Validators.required]],
      dosevial: [
        this.vaccineItem.material_no_of_doses_per_vial,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      extraDoses: [this.vaccineItem.extraDoses],
      doses_consumed: [''],
      status: [this.vaccineItem.status === 'Enable' ? true : false],
      noOfDosevial: [this.vaccineItem.no_of_doses_in_batch],
    });
    this.cSelected = this.vaccineItem.material_color
      ? this.vaccineItem.material_color
      : '';
  }

  quantityVialsno(data) {
    this.vaccineItem.no_of_vials = !data.target.value ? 0 : data.target.value;
    this.vaccineItem.no_of_doses_in_batch =
      parseInt(this.vaccineItem.no_of_vials) *
        parseInt(this.vaccineItem.material_no_of_doses_per_vial) +
      parseInt(this.vaccineItem.extraDoses);
    //this.quantityVialsValue = data.target.value;
    // console.log('quantityVialsValue', this.quantityVialsValue)
    this.editVaccineForm
      .get('noOfDosevial')
      .setValue(this.vaccineItem.no_of_doses_in_batch);
  }

  dosevialno(data) {
    this.vaccineItem.material_no_of_doses_per_vial = !data.target.value
      ? 0
      : data.target.value;
    this.vaccineItem.no_of_doses_in_batch =
      parseInt(this.vaccineItem.no_of_vials) *
        parseInt(this.vaccineItem.material_no_of_doses_per_vial) +
      parseInt(this.vaccineItem.extraDoses);
    //this.quantityVialsValue = data.target.value;
    // console.log('quantityVialsValue', this.quantityVialsValue)
    this.editVaccineForm
      .get('noOfDosevial')
      .setValue(this.vaccineItem.no_of_doses_in_batch);
    // this.dosevialvalue = data.target.value;
    // console.log('dosevialvalue', this.dosevialvalue)
  }

  extraDoseno(data) {
    this.vaccineItem.extraDoses = !data.target.value ? 0 : data.target.value;
    this.vaccineItem.no_of_doses_in_batch =
      parseInt(this.vaccineItem.no_of_vials) *
        parseInt(this.vaccineItem.material_no_of_doses_per_vial) +
      parseInt(this.vaccineItem.extraDoses);

    this.editVaccineForm
      .get('noOfDosevial')
      .setValue(this.vaccineItem.no_of_doses_in_batch);
    // this.extraDoseValue = data.target.value;
    // console.log('extraDoseValue', this.extraDoseValue)
  }

  editVaccineFormSub() {
    let formValues = this.editVaccineForm.value;
    if (!this.editVaccineForm.valid) {
      return;
    }

    let recievedDate = this.datepipe.transform(
      formValues.recievedDate ? formValues.recievedDate : new Date(),
      'yyyy-MM-dd'
    );
    let expiryDate = this.datepipe.transform(
      formValues.expiryDate ? formValues.expiryDate : new Date(),
      'yyyy-MM-dd'
    );

    if (recievedDate > expiryDate) {
      this.notify.showNotification(
        'Received Date must be less or equal to Expiry Date',
        'top',
        'error'
      );
      return false;
    }

    let reqObj = {
      id: this.vaccineId,
      batch_no: formValues.batchNumber,
      site_id: this.site_ids[0],
      status: formValues.status ? 'Enable' : 'Disable',
      expected_availability_date: recievedDate,
      received_date: recievedDate,
      expiry_date: expiryDate,
      no_of_vials: this.vaccineItem.no_of_vials,
      no_of_doses_in_batch: this.vaccineItem.no_of_doses_in_batch,
      material_name: this.selectedvaccine.name,
      material_description: this.selectedvaccine.description,
      material_no_of_doses_in_series: this.selectedvaccine
        .no_of_doses_in_series,
      material_gaps_in_days_between_doses: this.selectedvaccine
        .gaps_in_days_between_doses
        ? this.selectedvaccine.gaps_in_days_between_doses
        : 0,
      material_no_of_doses_per_vial: this.vaccineItem
        .material_no_of_doses_per_vial,
      material_type: this.selectedvaccine.type,
      material_id: this.selectedvaccine.id,
      doses_consumed: parseInt(this.vaccineItem.doses_consumed),
      extraDoses: this.vaccineItem.extraDoses,
      material_color:this.cSelected
    };

    this._siteAdminService.addMaterial(reqObj).subscribe(
      (res) => {
        //console.log(res);
        this._router.navigate(['/site-admin/list-vaccine']);
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  convertToInt(value: any) {
    let number: number = parseInt(value);
    if (isNaN(number)) return 0;
    else return number;
  }
  colorSelected(colour, event) {
    if (event.srcElement.classList[0] === 'checked') {
      return;
    }
    let childrenArr: any[] = this.children.toArray();
    for (let obj of childrenArr) {
      obj.nativeElement.className = '';
      setTimeout(obj.nativeElement.classList.add('unchecked'), 0);
    }
    this.cSelected = colour;
    console.log('Selected Colour : ' + colour);
    event.srcElement.classList.remove('unchecked');
    setTimeout(event.srcElement.classList.add('checked'), 0);
  }
}
