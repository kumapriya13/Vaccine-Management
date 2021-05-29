import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import * as moment from 'moment';
import { AdminToken, SiteAdminService, AuthManageService, ExcelService } from 'src/app/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { VisitScheduleReq } from '../models/site-admin.model';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentCommonModelComponent } from '../../../shared/components/component-common-model/component-common-model.component';
declare var $: any
@Component({
  selector: 'app-page-view-seat-schedule',
  templateUrl: './page-view-seat-schedule.component.html',
  styleUrls: ['./page-view-seat-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class PageViewSeatScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  private awake$ = new Subject<void>();

  @ViewChild('tableScroll', { read: ElementRef }) public tableScroll: ElementRef<any>;
  @ViewChild(ComponentCommonModelComponent) modelComponent: ComponentCommonModelComponent
  dateRange = [];
  siteIds: any[];
  totalCount = 0;
  pageIndex = 0;
  pageSize = 1;

  timeSlotSource: any[] = [];
  searchText = '';
  calenderDate = moment(); // FIXME: Need to after demo
  dateCon = new FormControl((new Date()));
  routedSeat: any;
  slotDuration: number = 30;
  dateRenderArray = { name: "Slot Time", date: [] };
  seatsSource: any[] = [];
  finalRenderData: any[] = [];
  diff: number;
  selectedDateObjects: any;
  finalSlotDataArr: any[];
  finalSeatDataArr: any[];
  finalRenderDataArr: any[];

  countOpen = 0;
  countCompleted = 0;
  countObservation = 0;
  countUpcoming = 0;
  countBooked = 0;
  countMissed = 0;
  renderSeatItem: any;

  availableDoses = {
    moderna: 0,
    pfizer: 0,
    janssen: 0
  };

  consumedDoses = {
    moderna: 0,
    pfizer: 0,
    janssen: 0
  };

  get availableDosesStr() {
    return "Janssen: " + this.availableDoses.janssen + "  |  Moderna: " + this.availableDoses.moderna + "  |  Pfizer: " + this.availableDoses.pfizer;
  }

  get consumedDosesStr() {
    return "Janssen: " + this.consumedDoses.janssen + "  |  Moderna: " + this.consumedDoses.moderna + "  |  Pfizer: " + this.consumedDoses.pfizer;
  }

  constructor(
    private location: Location,
    private authManageService: AuthManageService,
    private siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private router: ActivatedRoute,
    private _loader: SpinnerService,
    private datepipe: DatePipe,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private excelService: ExcelService,

  ) { }

  ngOnInit(): void {
    this.siteIds = this.authManageService.getLoggedInUser()?.site_ids;

    this._loader.recepientIDSubjectObservable.subscribe((data: any) => {
      if (data.hasOwnProperty('status') && data.status == 'load_seats') {
        this.loadSeat();

      }
    }, (err) => {
      this._loader.hideLoader();
    })
  }

  ngAfterViewInit(): void {
    this.router.params.pipe(take(1)).subscribe((params) => {
      this.routedSeat = params;
      this.loadSeat();
    });
  }

  backClicked = () => {
    this.location.back();
  };

  loadSeat() {
    this.calenderDate = moment(new Date(this.dateCon.value));
    this.generateSeat({
      siteId: _.first(this.siteIds),
      startDate: moment(new Date(this.dateCon.value)).format('YYYY-MM-DD'),
      endDate: moment(new Date(this.dateCon.value)).format('YYYY-MM-DD'),
      page: this.pageIndex + 1,
      pageLength: this.pageSize,
    } as VisitScheduleReq);
  }

  generateSeat = (req: VisitScheduleReq) => {
    this._loader.showLoader();
    this.siteAdminService
      .getScheduleVisit(req)
      .pipe(takeUntil(this.awake$))
      .subscribe(
        (res) => {
          this._loader.hideLoader();
          this.totalCount = res.slots.resultMetadata.count;
          this.pageIndex = res.slots.resultMetadata.page - 1;

          // console.log(Object.values(res.slots.results));
          // this.seatsSource.push(...res.slots.seats);

          // if (this.totalCount > (this.pageSize * (this.pageIndex + 1))) {
          //   this.pageIndex = 0;
          //   this.pageSize = this.totalCount;
          //   // this.loadSeat();
          // } else {
          this.timeSlotSource = res.slots.results;
          this.seatsSource = res.slots.seats;
          this.generateSeatWhenAllRecordLoaded();
          // }
        },
        (err) => {
          this._loader.hideLoader();
          this.notify.showNotification(
            'something went wrong',
            'bottom',
            'error'
          );
        }
      );
  };


  generateSeatWhenAllRecordLoaded(): void {
    let firstDateKey = Object.keys(this.timeSlotSource).sort()[0];
    let finalSlotDataArr: any[] = [];
    let finalSeatDataArr: any[] = [];
    let finalRenderDataArr: any[] = []

    if (firstDateKey) {
      let timeSlotSourceArr: any[] = Object.entries(this.timeSlotSource[firstDateKey]);
      let timeSlotSourceSortArr: any[] = timeSlotSourceArr.sort((a, b) => (moment(a[0]).isBefore(moment(b[0]))) ? -1 : ((moment(b[0]).isBefore(moment(a[0]))) ? 1 : 0))

      timeSlotSourceSortArr.forEach(element => {
        finalSlotDataArr.push(element[0]);
        let avlSeatsSource: any[] = Object.entries(element[1]);

        avlSeatsSource.forEach(ele => {
          let findSeatsNameIndex = finalSeatDataArr.findIndex((item: any) => item['seat_name'].localeCompare(ele[0]) == 0);
          if (findSeatsNameIndex == -1) {
            finalSeatDataArr.push({
              seat_name: ele[0]
            });
          }
        });
      });

      let $this = this;
      finalSeatDataArr = finalSeatDataArr.map(function (ele) {
        var o = Object.assign({}, ele);
        let item = $this.seatsSource.find((item: any) => item['seat_name'].localeCompare(ele.seat_name) == 0);
        if (item) {
          if (!item['seat_allocation_type'])
            item['seat_allocation_type'] = "Public";

          item.seat_allocation_type = String(item.seat_allocation_type).toLowerCase().trim();
          o.seat_info = item;
        }
        else
          o.seat_info = null;

        return o;
      })


      timeSlotSourceSortArr.forEach(element => {
        let avlSeatsSource: any[] = Object.entries(element[1]);
        let seatDataArr: any[] = JSON.parse(JSON.stringify(finalSeatDataArr));

        avlSeatsSource.forEach(ele => {
          let findIndex = seatDataArr.findIndex(item => item['seat_name'].localeCompare(ele[0]) == 0);

          if (findIndex > -1) {
            let item: any = ele[1][0];
            var date1 = moment(item['start_time']);
            var date2 = moment(item['end_time']);
            var diff = date2.diff(date1, "m");
            item['time_diff'] = diff;
            seatDataArr[findIndex]['data'] = item;
          }
        });

        finalRenderDataArr.push({
          slotDateTime: element[0],
          seatsArr: seatDataArr
        });
      });
    }

    this.finalSlotDataArr = finalSlotDataArr;
    this.finalSeatDataArr = finalSeatDataArr;
    this.finalRenderDataArr = finalRenderDataArr;

    this.countBooked = 0;
    this.countCompleted = 0;
    this.countObservation = 0;
    this.countUpcoming = 0;
    this.countOpen = 0;
    this.countMissed = 0;

    this.availableDoses = {
      moderna: 0,
      pfizer: 0,
      janssen: 0
    };
  
    this.consumedDoses = {
      moderna: 0,
      pfizer: 0,
      janssen: 0
    };

    finalRenderDataArr.forEach(renderItem => {
      renderItem.seatsArr.forEach(renderSeatItem => {
        if (renderSeatItem['data']) {
          if (renderSeatItem['data'].status == 'booked') {
            this.countBooked++;
            if (renderSeatItem['data'].status == 'booked' && renderSeatItem['data'].visit_status == 'completed') {
              this.countCompleted++;
              this.setConsumedDoses(renderSeatItem);
            }
            else {
              this.setAvailableDoses(renderSeatItem);
              if (renderSeatItem['data'].status == 'booked' && renderSeatItem['data'].visit_status == 'checked-in') {
                this.countObservation++;
              }
              else if (renderSeatItem['data'].status == 'booked' && renderSeatItem['data'].visit_status != 'completed' && renderSeatItem['data'].visit_status != 'checked-in') {
                this.countUpcoming++;
              }
            }
          }
          else if (renderSeatItem['data'].status == 'open') {
            this.countOpen++;
          }
          else if (renderSeatItem['data'].status == 'missed') {
            this.countMissed++;
            this.setAvailableDoses(renderSeatItem);
          }
        }
      });
    });
    this.countBooked = this.countBooked + this.countMissed;
    $(document).ready(function () {
      document.querySelectorAll('table.main-table.clone').forEach(e => e.remove());
      $(".main-table").clone(true).appendTo('#table-scroll').addClass('clone');
    });
  }

  setAvailableDoses(renderSeatItem) {
    console.log(renderSeatItem);
    if (renderSeatItem['data'].material_name == "Moderna") {
      this.availableDoses.moderna++;
    } else if (renderSeatItem['data'].material_name == "Janssen") {
      this.availableDoses.janssen++;
    } else if (renderSeatItem['data'].material_name == "Pfizer") {
      this.availableDoses.pfizer++;
    }
  }

  setConsumedDoses(renderSeatItem) {
    if (renderSeatItem['data'].material_name == "Moderna") {
      this.consumedDoses.moderna++;
    } else if (renderSeatItem['data'].material_name == "Janssen") {
      this.consumedDoses.janssen++;
    } else if (renderSeatItem['data'].material_name == "Pfizer") {
      this.consumedDoses.pfizer++;
    }
  }

  ngOnDestroy(): void {
    this.awake$.next();
    this.awake$.complete();
  }

  getDataDiff(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return minutes;
  }

  downloadDailySiteSchedule(): void {
    this._loader.showLoader();
    this.siteAdminService.getDailySiteScheduleReport(this.calenderDate.toDate()).subscribe((result) => {
      this._loader.hideLoader();
      if (result.length) {
        const rows = ['Time, First Name, Last Name, Survey Id, DOB, Status, Email, Phone,Vaccine Name'];
        result.forEach(visit => {
          const startTime = visit['Time'];
          const firstName = visit['First Name'];
          const lastName = visit['Last Name'];
          const dob = visit['Date of Birth'] ? this.getValidDate(visit['Date of Birth']) : '';
          const surveyId = visit['Survey Id'];
          const status = visit['Status'] ? visit['Status'] : '';
          const email = visit['Recipient Email'] ? visit['Recipient Email'] : '';
          const phone = visit['Phone'] ? visit['Phone'] : '';
          const vaccine = visit['Vaccine Material'] ? visit['Vaccine Material'] : '';
          const row = `${startTime},${firstName},${lastName},${surveyId},${dob},${status}, ${email}, ${phone},${vaccine}`;
          rows.push(row);
        });
        var blob = new Blob([rows.join('\r\n')], { type: 'text/plain' });
        saveAs(blob, `Daily Site Schedule (${moment(this.calenderDate).format('YYYY-MM-DD')}).csv`);
      } else {
        this.notify.showNotification(
          'No Record Found',
          'bottom',
          'error'
        );
      }
    }, (err) => {
      this._loader.hideLoader();
    })
  }

  getValidDate(date: any) {
    let dt = date;
    //
    if (dt == 'Invalid date' || dt == '1900-01-01' || dt == '') {
      dt = ''
    }
    else {
      dt = moment(dt).format('YYYY-MM-DD');
    }
    return dt;
  }

  downloadInventoryReport(): void {
    this._loader.showLoader();
    this.siteAdminService.getDailyInventoryReport(this.calenderDate.toDate()).subscribe((result) => {
      this._loader.hideLoader();
      if (result.length) {
        this.excelService.exportAsExcelFile(result, `Vaccine Inventory Report (${moment(this.calenderDate).format('YYYY-MM-DD')}).xlsx`);
      } else {
        this.notify.showNotification('No Record Found', 'bottom', 'error');
      }
    }, (err) => {
      this._loader.hideLoader();
    });
  }


  showAppointment(data) {
    console.log("2212", data);
    this.modelComponent.openHelpModel(data, [{ action: 'cancelappointment', status: true }, { action: 'bookappointment', status: true }])
  }

  moveRight() {
    this.tableScroll.nativeElement.scrollTo({ left: (this.tableScroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  moveLeft() {
    this.tableScroll.nativeElement.scrollTo({ left: (this.tableScroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public getBookedTicketLabel(tkt: string, obj: any): string {
    const visitStatusTicketValue = obj.visit_status ? tkt + '(' + obj.visit_status.substring(0, 4) + ')' : tkt;
    return obj.material_name ? obj.material_name?.charAt(0).toUpperCase() + ' - ' + visitStatusTicketValue : visitStatusTicketValue;
  }

  public getMissedTicketLabel(recordData): string {
    return recordData?.material_name ? recordData?.material_name?.charAt(0)?.toUpperCase() + ' - ' + recordData?.ticket_number : recordData?.ticket_number;
  }
}
