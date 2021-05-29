import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as moment from 'moment';

import { SiteAdminService } from '../../../../core';
import { NgModel } from '@angular/forms';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ComponentCommonModelComponent } from 'src/app/shared/components/component-common-model/component-common-model.component';

export interface PeriodicElement {
  id: string;
  seat: string;
  vaccinator: string[];
  vaccine: string;
  allocation: string;
  status: string;
  setSchedule: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-page-list-seat',
  templateUrl: './page-list-seat.component.html',
  styleUrls: ['./page-list-seat.component.scss'],
})
export class PageListSeatComponent implements OnInit {
  @ViewChildren('children') children: QueryList<NgModel>;
  @ViewChild(ComponentCommonModelComponent) modelComponent: ComponentCommonModelComponent

  displayedColumns: string[] = [
    'setSchedule',
    'seat',
    'vaccinator',
    'vaccine',
    'allocation',
    'status',
    'id',
  ];

  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;
  opt = [10, 25, 50, 100]
  @ViewChildren('children') childrena: QueryList<NgModel>;

  checkAll: boolean = false;
  generateSeatIds: any[] = [];
  processingSeats: any[] = [];

  seatsDataSource: any[] = [];
  seatData: any;
  searchText: string = '';

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  allocationMenuItems = [
    { name: 'Public', label: 'Convert To Public' },
    { name: 'Private', label: 'Convert To Private' }
  ]
  selectedAllocationIds: any[];
  public openManageScheduleActiveModal: Boolean = false;

  constructor(
    private seatsService: SiteAdminService,
    private notify: NotificationService,
    private route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _spinner: SpinnerService
  ) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {
    this.getSeats(this.pageIndex + 1, this.pageSize, this.searchText);
    this.getProcessingSeats();
  }

  getSeats(pageIndex: number, pageSize: number, searchText: string) {
    this._spinner.showLoader();
    this.pageSize = pageSize;
    this.seatsService
      .getSeats(pageIndex, pageSize, searchText)
      .subscribe((res) => {
        this._spinner.hideLoader();
        this.seatsDataSource = res.results;
        this.mapTableData();
        this.totalCount = res.resultMetadata.count;
        this.pageIndex = res.resultMetadata.page - 1;

        // console.log(pageIndex,this.pageIndex)
      });
  }

  getProcessingSeats() {
    const reqObj = {};
    this._spinner.showLoader();
    this.seatsService.searchSlotsForDateRangeBatch({}).subscribe((res) => {
      this._spinner.hideLoader();
      const { results } = res;

      for (let item of results) {
        item.seat_ids.forEach((sid) =>
          this.processingSeats.push({
            seat: sid,
            status: item.status,
          })
        );
      }
    });
  }

  setSeatId(id) {
    const index = this.generateSeatIds.findIndex((seatId) => seatId === id);

    if (index === -1) {
      this.generateSeatIds.push(id);
    } else {
      this.generateSeatIds.splice(index, 1);
    }
  }

  mapTableData() {
    let dataArr = [];
    this.seatsDataSource.forEach((value: any) => {
      const processing = this.processingSeats.find(
        (ps) => ps.seat === value.id
      );
      dataArr.push({
        id: value.id,
        seat: value.seat_name,
        schedule: processing
          ? processing.status
          : moment(value.modify_time).format('MM/DD/YYYY'),
        vaccine: value.$expanded.vaccine_name,
        allocation: value.seat_allocation_type,
        status: value.status,
        setSchedule: value.id,
        quantity_in_vials: value.quantity_in_vials,
        vaccine_id: value.vaccine_id,
        site_id: value.site_id,
        vaccinator_ids: value.vaccinator_ids,
        is_active: value.is_active,
      });
    });

    this.dataSource = new MatTableDataSource<PeriodicElement>(dataArr);
    this.dataSource.sort = this.sort;
  }

  getPageSeats($event) {
    this.checkAll = false;
    this.getSeats($event.pageIndex + 1, $event.pageSize, this.searchText);
  }

  navToEditSeatPage(seatItem: any) {
    this._router.navigate(['/site-admin/edit-seat', seatItem.id]);
  }

  onDeleteSeat(seatItem) {
    this._spinner.showLoader();
    this.seatsService.deleteSeat(seatItem.id).subscribe(
      (res) => {
        this._spinner.hideLoader();
        if (res) this.notify.showNotification('Seat delete successfully');
        this.getSeats(this.pageIndex, this.pageSize, this.searchText);
      },
      (err) =>
        this.notify.showNotification('Something went wrong', 'bottom', 'error')
    );
  }

  applyFilter(event: HTMLInputElement) {
    this.searchText = event.value;
    this.getSeats(1, this.pageSize, this.searchText);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkIFBlankLoadData(searchText) {
    if (searchText.value.trim() == '') {
      this.searchText = '';
      this.getSeats(1, this.pageSize, this.searchText);
    }
  }

  addSchedule(seatItem: any) {
    localStorage.setItem('seatsid', seatItem.id);
    this._router.navigate(['/site-admin/manage-calender']);
  }

  addMultipleSchedule() {
    //-- start
    this.generateSeatIds = [];
    let childrenArr: any[] = this.children.toArray();
    childrenArr.forEach((element) => {
      if (element._checked) this.generateSeatIds.push(element.value);
    });

    console.log('generateSeatIds=' + JSON.stringify(this.generateSeatIds));
    if (this.generateSeatIds.length == 0) {
      this.notify.showNotification('Please select seats.', 'top', 'error');
      return false;
    }
    //--end
    this._router.navigate([
      '/site-admin/manage-calender',
      { seats: JSON.stringify(this.generateSeatIds) },
    ]);
  }

  viewSchedule(seatItem: any): void {
    localStorage.setItem('seatsid', seatItem.id);
    this._router.navigate(['/site-admin/seat-view/', seatItem.seat]);
  }

  openViewSchedule(): void {
    this._router.navigate(['/site-admin/seat-view']);
  }

  checkUncheckAll(event) {
    if (event.checked == true) this.checkAll = true;
    else this.checkAll = false;
  }
  disableControl(object: any): boolean {

    let check = object.status.toLowerCase() == 'active' || object.status.toLowerCase() == 'enable' ? true : false;
    return check
  }

  changeAllocation(allocationType: any) {

    this.selectedAllocationIds = [];
    let allselected = [];
    this.children.toArray().forEach((element: any) => {
      if (element._checked) allselected.push(element.value.id);
      if (element._checked && element.value.allocation.toLowerCase() !== allocationType.name.toLowerCase()) this.selectedAllocationIds.push(element.value.id);
    });
    console.log("allocationType", allocationType, this.selectedAllocationIds);
    //return;
    if (allocationType && this.selectedAllocationIds.length > 0) {
      let payload = {
        "seatIds": this.selectedAllocationIds,
        "allocationType": allocationType.name
      }
      this.seatsService.changeSeatAllocationType(payload).subscribe((data: any) => {
        if (data.status == "success") {
          this.notify.showNotification(
            'Allocation updated successfully.',
            'top',
            'success'
          );
          this.getSeats(1, this.pageSize, "");
          console.log("success", "Allocation updated successfully.");
        }
      }, (err) => {
        console.log("error", "Opps something went wrong.");
        this.notify.showNotification('Opps something went wrong. Please try again', 'top', 'error')
      })

    } else {
      if (allselected.length > 0) {
        this.notify.showNotification('You have selected same event. Please select other', 'top', 'error')
        return;
      }
      this.notify.showNotification('Please select at least one item.', 'top', 'error')
    }
  }

  public openManageSchedule(): void {
    this.modelComponent.openManageSchedule();
  }

}
