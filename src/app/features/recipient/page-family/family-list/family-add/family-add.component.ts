import { Component, Input, OnInit, Output, EventEmitter, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FAMILY_RELATION_TYPES } from 'src/app/shared/helpers/constant';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'family-add',
  templateUrl: './family-add.component.html',
  styleUrls: ['./family-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FamilyAddComponent implements OnInit {
  @Output() openChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any[]>();

  @Input()
  set open(open: boolean) {
    this._open = open;
    this.open && this.openModal();
  }

  get open(): boolean {
    return this._open;
  }
  @ViewChild('content') contentTemplate: TemplateRef<any>;

  profile: any;

  formArray: FormArray = new FormArray([]);
  memberProfiles: any[] = [];
  busy: boolean;
  maxDate: Date;
  FAMILY_RELATIONS = FAMILY_RELATION_TYPES;

  private _open: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private modalService: NgbModal,
  ) {
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const currentDate = currentDateObj.getDate();

    this.maxDate = new Date(currentYear - 12, currentMonth, currentDate);
  }

  ngOnInit(): void {
    this.addNew();

    this.formArray.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.memberProfiles = this.formArray.controls.filter((control) => control.valid).map((control) => control.value);
      this.memberProfiles.forEach((profile) => {
        profile.dob = moment(profile.dob).format('YYYY-MM-DD');
      })
    });
  }

  ngOnDestroy(): void {}

  openModal(): void {
    this.modalService
      .open(this.contentTemplate, { windowClass: 'family-add-dialog'})
      .result.then((result) => {
        console.log(result, 'result');
      })
      .finally(() => {
        this.open = false;
        this.busy = false;

        setTimeout(() => {
          this.formArray.clear();
        }, 300);
        this.openChange.emit(this.open);
      });
  }

  addNew(): void {
    this.profile = JSON.parse(localStorage.getItem('recipient-user'));

    const formGroup = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      dob: [null, Validators.required],
      phone: [null, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [null, [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      address1: [this.profile.address1],
      address2: [this.profile.address2],
      address3: [this.profile.address3],
      city: [this.profile.city],
      zip: [this.profile.zip, [Validators.required, Validators.pattern('^[0-9]*$')]],
      state: [this.profile.state, null],
      country: [this.profile.country, null],
      county: [this.profile.county],
      primary_relationship: [null, Validators.required],
    });

    this.formArray.push(formGroup);
  }

  removeAt(index: number): void {
    this.formArray.removeAt(index);
  }

  onSave(): void {
    if (this.memberProfiles.length > 0) {
      this.save.emit(this.memberProfiles);
      this.modalService.dismissAll();
    }
  }

  getage(dateString) {
    let today = new Date();
    var birthDate = new Date(dateString.value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (m < 0) {
      m += 12;
    }
    if (age < 12) {
      return this.notificationService.showNotification('Age should be greater than 12', 'top', 'error');
    }
  }
}
