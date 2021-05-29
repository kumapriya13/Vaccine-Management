import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SiteAdminService } from 'src/app/core';

import { SpinnerService } from '../../../core/services/spinner.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-component-manage-schedule',
  templateUrl: './component-manage-schedule.component.html',
  styleUrls: ['./component-manage-schedule.component.scss'],
})
export class ComponentManageScheduleComponent implements OnInit {
  public manageScheduleOptions: string[] = ['Move Schedule', 'Cancel Schedule'];
  public bookingStatusOptions: any[] = [
    { text: 'Missed', value: 'missed' },
    { text: 'Booked', value: 'booked' },
    { text: 'Checked In', value: 'checked-in' },
    { text: 'Open', value: 'open' },
  ];
  public doseOptions: any[] = [
    { text: 'Select all', value: 'select_all' },
    { text: 'Dose 1', value: 'dose 1' },
    { text: 'Dose 2', value: 'dose 2' },
  ];
  public slotOptions: string[] = ['Select All', 'Public', 'Private'];
  public displayedColumns: string[] = [
    'selectSeat',
    'recipient',
    'date',
    'time',
    'mobileNumber',
    'email',
    'vaccineAndDose',
    'dob',
  ];

  seats: any[];
  selectedSeats: any[];

  slots: any[];
  slotSelectionInfo: { [key: string]: boolean } = {};

  public checkAll: boolean = false;

  filterFormGroup: FormGroup;
  targetFormGroup: FormGroup;

  public dataSource = new MatTableDataSource<any>([]);

  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private siteAdminService: SiteAdminService,
    private fb: FormBuilder,
    private spinner: SpinnerService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
  ) {
    this.filterFormGroup = this.fb.group({
      bookingStatus: [[this.bookingStatusOptions[0].value], Validators.required],
      seatIds: [[], Validators.required],
      doseList: [this.doseOptions[0].value, Validators.required],
      allocationType: [this.slotOptions[0], Validators.required],
      fromStartDate: [null, Validators.required],
      fromEndDate: [null, Validators.required],
      fromStartTime: [null, Validators.required],
      fromEndTime: [null, Validators.required],
    });
    this.targetFormGroup = this.fb.group({
      type: [null, Validators.required],
      targetDate: [null, Validators.required],
      targetTime: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSeats();
  }

  applyFilter(): void {
    Object.keys(this.filterFormGroup.controls).forEach((field) => {
      const control = this.filterFormGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.filterFormGroup.valid) {
      this.slotSearchSchedule();
    }
  }

  resetFilter(): void {
    this.filterFormGroup.reset();
  }

  slotSearchSchedule(): void {
    const seatIds = this.filterFormGroup.value.seatIds;
    const bookingStatus = this.filterFormGroup.value.bookingStatus;
    let doseList = [this.filterFormGroup.value.doseList];
    let allocationType = [this.filterFormGroup.value.allocationType];
    if (this.filterFormGroup.value.doseList === 'select_all') {
      doseList = ['dose 1', 'dose 2'];
    }
    if (this.filterFormGroup.value.allocationType === 'Select All') {
      allocationType = ['Public', 'Private'];
    }
    const fromStartDate = moment(this.filterFormGroup.value.fromStartDate).format('YYYY-MM-DD');
    const fromEndDate = moment(this.filterFormGroup.value.fromEndDate).format('YYYY-MM-DD');
    const fromStartTime = moment(this.filterFormGroup.value.fromStartTime, ['h:mm A']).format('HH:mm:ss');
    const fromEndTime = moment(this.filterFormGroup.value.fromEndTime, ['h:mm A']).format('HH:mm:ss');

    const filter = {
      bookingStatus,
      doseList,
      allocationType,
      seatIds,
      startTime: `${fromStartDate}T${fromStartTime}`,
      endTime: `${fromEndDate}T${fromEndTime}`,
    };

    this.spinner.showLoader();
    this.siteAdminService.slotSearchSchedule(filter).subscribe((result) => {
      this.slots = result.results;
      this.totalCount = this.slots?.length;
      this.pageIndex = 0;
      this.pageSize = 10;
      this.refreshGridData();
      this.spinner.hideLoader();

      this.slotSelectionInfo = {};
      this.slots.forEach((slot) => (this.slotSelectionInfo[slot.id] = false));
      this.checkAll = false;
    });
  }

  get selectedSlotIds(): string[] {
    return Object.keys(this.slotSelectionInfo).filter((key) => this.slotSelectionInfo[key]);
  }

  checkUncheckAll(event) {
    if (event.checked == true) this.checkAll = true;
    else this.checkAll = false;

    _.forIn(this.slotSelectionInfo, (value, key) => {
      this.slotSelectionInfo[key] = this.checkAll;
    });
  }

  updateCheckAllStatus(): void {
    this.checkAll = this.slots?.length === this.selectedSlotIds.length;
  }

  loadSeats(): void {
    this.siteAdminService.getSeats(1, 100).subscribe((res) => {
      this.seats = res.results;
    });
  }

  selectAllSeats(): void {
    this.filterFormGroup.get('seatIds').patchValue(this.seats?.map((seat) => seat.id));
  }

  close(): void {
    this.modalService.dismissAll();
  }

  onPageChange({ pageIndex, pageSize }): void {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.refreshGridData();
  }

  refreshGridData(): void {
    this.dataSource.data = this.slots?.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  proceed(): void {
    Object.keys(this.targetFormGroup.controls).forEach((field) => {
      const control = this.targetFormGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.targetFormGroup.valid) {
      if (this.selectedSlotIds?.length > 0) {
        const selectedSlotIds = this.selectedSlotIds;
        if (!confirm(`Are you sure to ${this.targetFormGroup.value.type === 'Move Schedule' ? 'move' : 'cancel'} ${selectedSlotIds.length} slot/appointment(s)?`)) {
          return;
        }

        const toStartDate = moment(this.targetFormGroup.value.targetDate).format('YYYY-MM-DD');
        const fromStartDate = moment(this.filterFormGroup.value.fromStartDate).format('YYYY-MM-DD');
        const fromStartTime = moment(this.filterFormGroup.value.fromStartTime, ['h:mm A']).format('HH:mm:ss');
        const fromStartDateTime = `${fromStartDate}T${fromStartTime}`;

        this.spinner.showLoader();
        if (this.targetFormGroup.value.type === 'Move Schedule') {
          this.siteAdminService
            .moveSlotVisitSlotList(this.selectedSlotIds, fromStartDateTime, toStartDate)
            .subscribe(() => {
              this.spinner.hideLoader();
              this.close();
            });
        } else {
          this.siteAdminService.cancelSlotVisitSlotList(this.selectedSlotIds).subscribe(() => {
            this.spinner.hideLoader();
            this.close();
          });
        }
      } else {
        this.notificationService.showNotification('Please choose at least one slot');
      }
    }
  }

  onTypeChange(event): void {
    if (event === 'Move Schedule') {
      this.targetFormGroup.get('targetDate').setValidators(Validators.required);
      this.targetFormGroup.get('targetTime').setValidators(Validators.required);
    } else {
      this.targetFormGroup.get('targetDate').setValidators(null);
      this.targetFormGroup.get('targetTime').setValidators(null);
    }
    this.targetFormGroup.get('targetDate').updateValueAndValidity();
    this.targetFormGroup.get('targetTime').updateValueAndValidity();
  }
}
