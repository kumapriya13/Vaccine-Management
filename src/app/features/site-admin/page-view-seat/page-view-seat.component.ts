import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { AdminToken, SiteAdminService, AuthManageService } from 'src/app/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { VisitScheduleReq } from '../models/site-admin.model';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ComponentCommonModelComponent } from 'src/app/shared/components/component-common-model/component-common-model.component';
// import { start } from 'node:repl';

@Component({
  selector: 'app-page-view-seat',
  templateUrl: './page-view-seat.component.html',
  styleUrls: ['./page-view-seat.component.scss'],
})
export class PageViewSeatComponent implements OnInit, OnDestroy {
  @ViewChild(ComponentCommonModelComponent) modelComponent : ComponentCommonModelComponent
  private awake$ = new Subject<void>();
  dateRange = [];
  siteIds: any[];
  totalCount = 0;
  pageIndex = 0;
  pageSize = 1000;

  seatsSource: any[] = [];
  searchText = '';
  // now = moment(); // FIXME: Need to after demo
  startOfWeek = moment().startOf('week');
  endOfWeek = moment().endOf('week');
  dateCon = new FormControl(new Date());
  routedSeat: any;
  slotDuration: number;
  timeSlotSource: any;
  finalAllSlotDataArr: any[];
  finalAllSeatDataArr: any[];
  finalAllRenderDataArr: any[];
  finalSlotDataArrSortArr: any[];
  finalSeatDataArr: any[];
  finalSlotDataArr: any[];
  finalRenderDataArr: any[];
  weekDays: any[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  countOpen = 0;
  countBooked = 0;
  countCompleted = 0;
  countObservation = 0;
  countUpcoming = 0;
  countMissed = 0;

  constructor(
    private location: Location,
    private siteAdminService: SiteAdminService,
    private notify: NotificationService,
    private authManageService: AuthManageService,
    private router: ActivatedRoute,
    private _loader: SpinnerService
  ) { }

  ngOnInit(): void {
    this.siteIds = this.authManageService.getLoggedInUser()?.site_ids;
    this._loader.recepientIDSubjectObservable.subscribe((data: any) => {
      if(data.hasOwnProperty('status') && data.status=='load_seats'){
        this.loadSeat();

      }
    })
  }

  ngAfterContentInit(): void {
    this.router.params.pipe(take(1)).subscribe((params) => {
      this.routedSeat = params;
      console.log(this.routedSeat);
      this.loadSeat();
    });
  }

  backClicked = () => {
    this.location.back();
  };

  loadSeat() {
    this.startOfWeek = moment(new Date(this.dateCon.value)).startOf('week');
    this.endOfWeek = moment(new Date(this.dateCon.value)).endOf('week');
    this.generateSeat({
      siteId: _.first(this.siteIds),
      startDate: moment(new Date(this.dateCon.value))
        .startOf('week')
        .format('YYYY-MM-DD'),
      endDate: moment(new Date(this.dateCon.value))
        .endOf('week')
        .format('YYYY-MM-DD'),
      page: this.pageIndex + 1,
      pageLength: this.pageSize,
      seatId: localStorage.getItem('seatsid'),
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
          this.timeSlotSource = res.slots.results;
          this.seatsSource = res.slots.seats;
          let daysArr: any[] = Object.keys(this.timeSlotSource).sort();

          let finalAllSlotDataArr: any[] = [];
          let finalAllSeatDataArr: any[] = [];
          let finalAllRenderDataArr: any[] = [];

          let finalSlotDataArr: any[] = [];
          let finalSeatDataArr: any[] = [];
          let finalRenderDataArr: any[] = [];

          if (daysArr.length > 0) {
            let timeSlotSourceArr: any[] = [];
            daysArr.forEach((element) => {
              let arr: any[] = Object.entries(this.timeSlotSource[element]);
              timeSlotSourceArr.push(...arr);
            });

            let timeSlotSourceSortArr: any[] = timeSlotSourceArr.sort((a, b) =>
              moment(a[0]).isBefore(moment(b[0]))
                ? -1
                : moment(b[0]).isBefore(moment(a[0]))
                  ? 1
                  : 0
            );

            timeSlotSourceSortArr.forEach((element) => {
              finalAllSlotDataArr.push(element[0]);
              let avlSeatsSource: any[] = Object.entries(element[1]);

              avlSeatsSource.forEach((ele) => {
                let findSeatsNameIndex = finalAllSeatDataArr.findIndex(
                  (item: any) => item['seat_name'].localeCompare(ele[0]) == 0
                );
                if (findSeatsNameIndex == -1) {
                  finalAllSeatDataArr.push({
                    seat_name: ele[0],
                  });
                }
              });
            });

            let $this = this;
            finalAllSeatDataArr = finalAllSeatDataArr.map(function (ele) {
              var o = Object.assign({}, ele);
              let item = $this.seatsSource.find(
                (item: any) =>
                  item['seat_name'].localeCompare(ele.seat_name) == 0
              );
              if (item) {
                if (!item['seat_allocation_type'])
                  item['seat_allocation_type'] = 'Public';

                item.seat_allocation_type = String(item.seat_allocation_type)
                  .toLowerCase()
                  .trim();
                o.seat_info = item;
              } else o.seat_info = null;

              return o;
            });

            timeSlotSourceSortArr.forEach((element) => {
              let avlSeatsSource: any[] = Object.entries(element[1]);
              let seatDataArr: any[] = JSON.parse(
                JSON.stringify(finalAllSeatDataArr)
              );

              avlSeatsSource.forEach((ele) => {
                let findIndex = seatDataArr.findIndex(
                  (item) => item['seat_name'].localeCompare(ele[0]) == 0
                );

                if (findIndex > -1) {
                  let item: any = ele[1][0];
                  var date1 = moment(item['start_time']);
                  var date2 = moment(item['end_time']);
                  var diff = date2.diff(date1, 'm');
                  item['time_diff'] = diff;
                  seatDataArr[findIndex]['data'] = item;
                }
              });

              finalAllRenderDataArr.push({
                slotDateTime: element[0],
                seatsArr: seatDataArr,
              });
            });
          }

          finalAllSlotDataArr.forEach((ele) => {
            let time = moment(ele).format('HH:mm');
            let finalSlotTimeIndex = finalSlotDataArr.findIndex(
              (item: string) => item.localeCompare(time) == 0
            );
            if (finalSlotTimeIndex == -1) {
              finalSlotDataArr.push(moment(ele).format('hh:mm A'));
            }
          });
          let finalSlotDataArrSortArr: any[] = finalSlotDataArr.sort((a, b) =>
            moment('1900/01/01 ' + a).isBefore(moment('1900/01/01 ' + b))
              ? -1
              : moment('1900/01/01 ' + b).isBefore(moment('1900/01/01 ' + a))
                ? 1
                : 0
          );
          finalSlotDataArr = [...new Set(finalSlotDataArrSortArr)];

          finalSlotDataArr.forEach((element) => {
            let days: any[] = [];
            this.weekDays.forEach((dayItem: string, index) => {
              let day = dayItem;
              let date =
                moment(this.startOfWeek).add(index, 'd').format('YYYY-MM-DD') +
                ' ' +
                element;
              let slot = null;

              let find = finalAllRenderDataArr.find(
                (item) =>
                  moment(item.slotDateTime)
                    .format('YYYY-MM-DD HH:mm')
                    .localeCompare(moment(date, 'YYYY-MM-DD, hh:mm A').format('YYYY-MM-DD HH:mm')) == 0
              );

              if (find) {
                slot = find;
              }

              days.push({
                day: day,
                dateTime: date,
                slot: slot,
              });
            });

            finalRenderDataArr.push({
              slot_time: element,
              days: days,
            });
          });

          this.finalAllSlotDataArr = finalAllSlotDataArr;
          this.finalAllSeatDataArr = finalAllSeatDataArr;
          this.finalAllRenderDataArr = finalAllRenderDataArr;

          this.finalSlotDataArr = finalSlotDataArr;
          this.finalSeatDataArr = finalAllSeatDataArr;
          this.finalRenderDataArr = finalRenderDataArr;

          this.countBooked = 0;
          this.countCompleted = 0;
          this.countObservation = 0;
          this.countUpcoming = 0;
          this.countOpen = 0;
          this.countMissed = 0;

          finalRenderDataArr.forEach((renderItem) => {
            renderItem.days.forEach((renderDayItem) => {
              if (
                renderDayItem['slot'] &&
                renderDayItem['slot']['seatsArr'] &&
                renderDayItem['slot']['seatsArr'][0] &&
                renderDayItem['slot']['seatsArr'][0]['data']
              ) {
                if (
                  renderDayItem['slot']['seatsArr'][0]['data'].status ==
                  'booked'
                )
                  this.countBooked++;

                  if (renderDayItem['slot']['seatsArr'][0]['data'].status == 'booked' && renderDayItem['slot']['seatsArr'][0]['data'].visit_status == 'completed')
                  this.countCompleted++;

                if (renderDayItem['slot']['seatsArr'][0]['data'].status == 'booked' && renderDayItem['slot']['seatsArr'][0]['data'].visit_status == 'checked-in')
                  this.countObservation++;

                  if (renderDayItem['slot']['seatsArr'][0]['data'].status == 'booked' && renderDayItem['slot']['seatsArr'][0]['data'].visit_status != 'completed' && renderDayItem['slot']['seatsArr'][0]['data'].visit_status != 'checked-in')
                  this.countUpcoming++;

                else if (
                  renderDayItem['slot']['seatsArr'][0]['data'].status == 'open'
                )
                  this.countOpen++;
                else if (
                  renderDayItem['slot']['seatsArr'][0]['data'].status ==
                  'missed'
                )
                  this.countMissed++;
              }
            });
          });

          // console.log(this.finalRenderDataArr);
          // this.seatsSource = res.slots.results;
          // this.totalCount = res.slots.resultMetadata.count;
          // this.pageIndex = res.slots.resultMetadata.page - 1;
          // const objectBase = res.slots.results;
          // const requiredData = [];
          // let requiredSeatData = [];
          // this.dateRange = [];
          // let filteredDates: any[] = [];
          // for (const [key, value] of Object.entries(objectBase)) {
          //   if (Object.prototype.hasOwnProperty.call(objectBase, key)) {
          //     const element = value;
          //     for (const [key1, value1] of Object.entries(value)) {
          //       if (Object.prototype.hasOwnProperty.call(value, key1)) {
          //         requiredData.push({ ..._.head(value1[Object.keys(value1)[0]]), seat: key1 });
          //       }
          //     }
          //   }
          // }

          // requiredSeatData = _.flattenDeep(requiredData).filter(
          //   (r) => r.seat === this.routedSeat
          // );

          // console.log(requiredSeatData);
          // /** Solts with different dates -
          //  * but it not possible because of solt timing may different for other dates
          //  */
          // var selectedDateModule = {};
          // filteredDates = requiredData.filter(
          //   (d) => {
          //     if (!selectedDateModule.hasOwnProperty(moment(d.start_time).format('HH:mm'))) {
          //       selectedDateModule[moment(d.start_time).format('HH:mm')] = true;
          //       return true;
          //     }
          //   }
          // );

          // this.dateRange.push({
          //   day: 'Solt Time', // 1st iteration for date
          //   date: moment(this.now).format('MMM Do YY'),
          //   slots: filteredDates,
          // });
          // /** Continuation */
          // for (let i = 0; i <= 6; i++) {
          //   filteredDates = requiredData.filter(
          //     (d) =>
          //       moment(d.start_time).format('YYYY-MM-DD') ===
          //       moment(this.now).startOf('week').add(i, 'days').format('YYYY-MM-DD')
          //   );
          //   this.dateRange.push({
          //     day: moment(this.now).startOf('week').add(i, 'days').format('dddd'),
          //     date: moment(this.now).startOf('week').add(i, 'days').format('MMM Do YY'),
          //     slots: filteredDates,
          //   });
          // }

          // /** solts for current date
          //  * NOTE: do not delete the date
          //  */
          // /* filteredDates = requiredData.filter(
          //   (d) =>
          //     moment(d.start_time).format('YYYY-MM-DD') ===
          //     this.now.format('YYYY-MM-DD')
          // ); */

          // /* this.dateRange.push({
          //   day: 'Solt Time', // 1st iteration for date
          //   date: this.now.format('MMM Do YY'),
          //   slots: filteredDates,
          // });

          // this.dateRange.push({
          //   day: this.now.format('dddd'),
          //   date: this.now.format('MMM Do YY'),
          //   slots: filteredDates,
          // }); */

          // let topData = this.dateRange.filter((r) => {
          //   return r.slots.length > 0;
          // });
          // let headvar = _.head(topData);
          // if (_.head(topData) != undefined) {
          //   const head = _.head(headvar.slots) as any;
          //   this.slotDuration =
          //     (new Date(head.end_time).getTime() -
          //       new Date(head.start_time).getTime()) /
          //     60000;
          // }
          // //const head = .head(.head(topData).slots) as any;
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

  ngOnDestroy(): void {
    this.awake$.next();
    this.awake$.complete();
  }

  getTicketLabel(tkt: string, obj: any) {
    //console.log(obj);
    return obj.visit_status ? tkt + '(' + obj.visit_status.substring(0, 4) + ')' : tkt;
  }

  showAppointment(data){
    console.log("2212",data.slot.seatsArr[0].data);
   this.modelComponent.openHelpModel(data.slot.seatsArr[0].data,[{action : 'cancelappointment', status: true},{action: 'bookappointment', status: true}])
  }
}
