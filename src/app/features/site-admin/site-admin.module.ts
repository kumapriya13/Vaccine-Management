import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import {DatePipe} from '@angular/common';

import { SiteAdminRoutingModule } from './site-admin-routing.module';
import { SiteAdminComponent } from './site-admin.component';
// import { NoVaccinatorComponent } from './page-vaccinator/no-vaccinator/no-vaccinator.component';

import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageManageSeatComponent } from './page-manage-seat/page-manage-seat.component';
import { PageAddSeatComponent } from './page-manage-seat/page-add-seat/page-add-seat.component';
import { PageListSeatComponent } from './page-manage-seat/page-list-seat/page-list-seat.component';
import { PageVaccinatorComponent } from './page-vaccinator/page-vaccinator.component';
import { VaccinatorHeaderStripComponent } from './page-vaccinator/vaccinator-header-strip/vaccinator-header-strip.component';
import { PageAddVaccinatorComponent } from './page-vaccinator/page-add-vaccinator/page-add-vaccinator.component';
import { PageListVaccinatorComponent } from './page-vaccinator/page-list-vaccinator/page-list-vaccinator.component';
import { PageVaccineComponent } from './page-vaccine/page-vaccine.component';
import { PageAddVaccineComponent } from './page-vaccine/page-add-vaccine/page-add-vaccine.component';
import { PageListVaccineComponent } from './page-vaccine/page-list-vaccine/page-list-vaccine.component';
import { PageEditVaccineComponent } from './page-vaccine/page-edit-vaccine/page-edit-vaccine.component';
import { PageManageCalenderComponent } from './page-manage-calender/page-manage-calender.component';
import { NoSeatComponent } from './page-manage-seat/no-seat/no-seat.component';
import { EditSeatComponent } from './page-manage-seat/edit-seat/edit-seat.component';
import { NoVaccinatorComponent } from './page-vaccinator/no-vaccinator/no-vaccinator.component';
import { EditVaccinatorComponent } from './page-vaccinator/edit-vaccinator/edit-vaccinator.component';

import { BulkHeaderStripComponent } from './page-bulk/bulk-header-strip/bulk-header-strip.component';
import { PageBulkComponent } from './page-bulk/page-bulk.component';
import { PageBulkRecipientComponent } from './page-bulk/page-bulk-recipient/page-bulk-recipient.component';
import { SiteManageCalendarComponent } from './page-manage-calender/site-manage-calendar/site-manage-calendar.component';
import { ListManageCalendarComponent } from './page-manage-calender/list-manage-calendar/list-manage-calendar.component';
import { SiteSameScheduleComponent } from './page-manage-calender/site-same-schedule/site-same-schedule.component';
import { ListOfScheduleYesComponent } from './page-manage-calender/list-of-schedule-yes/list-of-schedule-yes.component';
import { ListOfScheduleNoComponent } from './page-manage-calender/list-of-schedule-no/list-of-schedule-no.component';
import { SiteSettingComponent } from './site-setting/site-setting.component';
import { PageVaccinatorScheduleComponent } from './page-vaccinator-schedule/page-vaccinator-schedule.component';
import { HoursSlotTimeComponent } from './page-manage-calender/hours-slot-time-component/hours-slot-time.component';
import { PageChangeUserIdPassComponent } from './page-change-user-id-pass/page-change-user-id-pass.component';
import { PageNewRegistrationComponent } from './page-new-registration/page-new-registration.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { PageVaccineReportComponent } from './page-vaccine/page-vaccine-report/page-vaccine-report.component';
import { PreviewCalendarComponent } from './page-manage-calender/preview-calendar/preview-calendar.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PageReceptionistComponent } from './page-receptionist/page-receptionist.component';
import { PageAddReceptionistComponent } from './page-receptionist/page-add-receptionist/page-add-receptionist.component';
import { PageListReceptionistComponent } from './page-receptionist/page-list-receptionist/page-list-receptionist.component';
import { PageEditReceptionistComponent } from './page-receptionist/page-edit-receptionist/page-edit-receptionist.component';
import { PageNoReceptionistComponent } from './page-receptionist/page-no-receptionist/page-no-receptionist.component';
import { ReceptionistListComponent } from './receptionist-list/receptionist-list.component';
import { ReceptionistCreateComponent } from './receptionist-create/receptionist-create.component';
import { PageEditRecepientComponent } from './page-edit-recepient/page-edit-recepient.component';
import { PageViewSeatComponent } from './page-view-seat/page-view-seat.component';
import { PageViewSeatScheduleComponent } from './page-view-seat-schedule/page-view-seat-schedule.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DailysitevaccinationComponent } from './dailysitevaccination/dailysitevaccination.component';
import { PageRecipientAppointmentComponent } from './page-recipient-appointment/page-recipient-appointment.component';
import { AdverseEventReportingModule } from 'src/app/pages/adverse-event-reporting/adverse-event-reporting.module';
import { PagePowerBiComponent } from './page-power-bi/page-power-bi.component';
// import { ManageScheduleComponent } from './page-manage-seat/components/manage-schedule/manage-schedule.component';


@NgModule({
  declarations: [
    SiteAdminComponent,
    PageDashboardComponent,
    HoursSlotTimeComponent,
    PageManageSeatComponent,
    PageAddSeatComponent,
    PageListSeatComponent,
    PageVaccinatorComponent,
    VaccinatorHeaderStripComponent,
    PageAddVaccinatorComponent,
    PageListVaccinatorComponent,
    PageVaccineComponent,
    PageAddVaccineComponent,
    PageListVaccineComponent,
    PageEditVaccineComponent,
    PageManageCalenderComponent,
    NoSeatComponent,
    EditSeatComponent,
    NoVaccinatorComponent,
    EditVaccinatorComponent,
    BulkHeaderStripComponent,
    PageBulkComponent,
    PageBulkRecipientComponent,
    SiteManageCalendarComponent,
    ListManageCalendarComponent,
    SiteSameScheduleComponent,
    ListOfScheduleYesComponent,
    ListOfScheduleNoComponent,
    SiteSettingComponent,
    PageVaccinatorScheduleComponent,
    PageChangeUserIdPassComponent,
    PageNewRegistrationComponent,
    BookAppointmentComponent,
    PageVaccineReportComponent,
    PreviewCalendarComponent,
    PageReceptionistComponent,
    PageAddReceptionistComponent,
    PageListReceptionistComponent,
    PageEditReceptionistComponent,
    PageNoReceptionistComponent,
    ReceptionistListComponent,
    ReceptionistCreateComponent,
    PageEditRecepientComponent,
    PageViewSeatComponent,
    PageViewSeatScheduleComponent,
    PageRecipientAppointmentComponent,
    DailysitevaccinationComponent,
    PagePowerBiComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SearchPipeModule,
    SiteAdminRoutingModule,
    AdverseEventReportingModule,
    MatProgressSpinnerModule
  ],providers: [DatePipe]

})
export class SiteAdminModule { }
