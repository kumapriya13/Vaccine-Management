import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteAdminComponent } from './site-admin.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageManageSeatComponent } from './page-manage-seat/page-manage-seat.component';
import { PageAddSeatComponent } from './page-manage-seat/page-add-seat/page-add-seat.component';
import { NoSeatComponent } from './page-manage-seat/no-seat/no-seat.component';
import { PageListSeatComponent } from './page-manage-seat/page-list-seat/page-list-seat.component';
import { PageVaccinatorComponent } from './page-vaccinator/page-vaccinator.component';
import { PageAddVaccinatorComponent } from './page-vaccinator/page-add-vaccinator/page-add-vaccinator.component';
import { PageListVaccinatorComponent } from './page-vaccinator/page-list-vaccinator/page-list-vaccinator.component';
import { PageVaccineComponent } from './page-vaccine/page-vaccine.component';
import { PageAddVaccineComponent } from './page-vaccine/page-add-vaccine/page-add-vaccine.component';
import { PageListVaccineComponent } from './page-vaccine/page-list-vaccine/page-list-vaccine.component';
import { PageEditVaccineComponent } from './page-vaccine/page-edit-vaccine/page-edit-vaccine.component';
import { PageManageCalenderComponent } from './page-manage-calender/page-manage-calender.component';
import { EditSeatComponent } from './page-manage-seat/edit-seat/edit-seat.component';
import { EditVaccinatorComponent } from './page-vaccinator/edit-vaccinator/edit-vaccinator.component';
import { PageBulkComponent } from './page-bulk/page-bulk.component';
import { PageBulkRecipientComponent } from './page-bulk/page-bulk-recipient/page-bulk-recipient.component';
import { SiteSettingComponent } from './site-setting/site-setting.component';
import { PageVaccinatorScheduleComponent } from './page-vaccinator-schedule/page-vaccinator-schedule.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { PageVaccineReportComponent } from './page-vaccine/page-vaccine-report/page-vaccine-report.component';
import { PreviewCalendarComponent } from './page-manage-calender/preview-calendar/preview-calendar.component';
import { PageNewRegistrationComponent } from './page-new-registration/page-new-registration.component';
import { PageChangeUserIdPassComponent } from './page-change-user-id-pass/page-change-user-id-pass.component';
import { PageAppointmentComponent } from './page-appointment/page-appointment.component';
import { PageAddReceptionistComponent } from './page-receptionist/page-add-receptionist/page-add-receptionist.component';
import { PageEditReceptionistComponent } from './page-receptionist/page-edit-receptionist/page-edit-receptionist.component';
import { PageNoReceptionistComponent } from './page-receptionist/page-no-receptionist/page-no-receptionist.component';
import { ReceptionistListComponent } from './receptionist-list/receptionist-list.component';
import { ReceptionistCreateComponent } from './receptionist-create/receptionist-create.component';
import { PageEditRecepientComponent } from './page-edit-recepient/page-edit-recepient.component';
import { PageViewSeatComponent } from './page-view-seat/page-view-seat.component';
import { PageViewSeatScheduleComponent } from './page-view-seat-schedule/page-view-seat-schedule.component';
import { DailysitevaccinationComponent } from './dailysitevaccination/dailysitevaccination.component'
import { PageRecipientAppointmentComponent } from './page-recipient-appointment/page-recipient-appointment.component';
import { AdverseEventReportingComponent } from '../../pages/adverse-event-reporting/adverse-event-reporting.component';
import { PagePowerBiComponent } from './page-power-bi/page-power-bi.component';
const routes: Routes = [
  {
    path: '',
    component: SiteAdminComponent,
    data: {user_type: 'site_admin'},
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'site-setting', component: SiteSettingComponent },
      { path: 'manage-seat', component: PageManageSeatComponent ,data: {location: 'seat'}},
      { path: 'add-seat', component: PageAddSeatComponent ,data: {location: 'seat'}},
      { path: 'no-seat', component: NoSeatComponent ,data: {location: 'seat'}},
      { path: 'list-seat', component: PageListSeatComponent,data: {location: 'seat'}
    },
      { path: 'edit-seat/:id', component: EditSeatComponent },
      { path: 'vaccinator', component: PageVaccinatorComponent,data: {location: 'vaccinator'} },
      { path: 'add-vaccinator', component: PageAddVaccinatorComponent,data: {location: 'vaccinator'}  },
      { path: 'list-vaccinator', component: PageListVaccinatorComponent,data: {location: 'vaccinator'} },
      { path: 'edit-vaccinator/:id', component: EditVaccinatorComponent,data: {location: 'vaccinator'}  },
      { path: 'vaccine', component: PageVaccineComponent,data: {location: 'vaccine'}},
      { path: 'add-vaccine', component: PageAddVaccineComponent,data: {location: 'vaccine'} },
      { path: 'list-vaccine', component: PageListVaccineComponent,data: {location: 'vaccine'}},
      { path: 'edit-vaccine/:id', component: PageEditVaccineComponent,data: {location: 'vaccine'} },
      { path: 'vaccine-report', component: PageVaccineReportComponent,data: {location: 'vaccine'} },
      { path: 'manage-calender', component: PageManageCalenderComponent },
      { path: 'preview-calender', component: PreviewCalendarComponent },
      { path: 'bulk-upload', component: PageBulkComponent },
      { path: 'bulk-recipient', component: PageBulkRecipientComponent },
      {
        path: 'vaccinator-schedule',
        component: PageVaccinatorScheduleComponent,
      },
      { path: 'change-userid', component: PageChangeUserIdPassComponent },
      { path: 'new-registration', component: PageNewRegistrationComponent },
      {
        path: 'appointment',
        loadChildren: () => import('./page-appointment/page-appointment.module').then(m => m.PageApointmentModule)
      },
      { path: 'book-appointment/:id', component: BookAppointmentComponent,data: {location: 'admin_appointment'} },
      { path: 'recipient-appointment/:id', component: PageRecipientAppointmentComponent },
      { path: 'recipient-appointment', component: PageRecipientAppointmentComponent },
      { path: 'adverse-event/:id', component: AdverseEventReportingComponent },
      { path: 'add-receptionist', component: PageAddReceptionistComponent,data: {location: 'admin_appointment'} },
      { path: 'edit-recepient/:id', component: PageEditRecepientComponent,data: {location: 'admin_appointment'} },

      { path: 'edit-receptionist', component: PageEditReceptionistComponent,data: {location: 'admin_appointment'}  },
      { path: 'no-receptionist', component: PageNoReceptionistComponent,data: {location: 'receptionist'}  },
      { path: 'list-receptionist', component: ReceptionistListComponent,data: {location: 'receptionist'} },
      { path: 'receptionist-create', component: ReceptionistCreateComponent },
      {
        path: 'receptionist-update/:id',
        component: ReceptionistCreateComponent,
        data: {location: 'receptionist'} 
      },
      { path: 'dailysite', component: DailysitevaccinationComponent },


      {
        path: 'notification-setting',
        loadChildren: () =>
          import('./notification-setting/notification-setting.module').then(
            (m) => m.NotificationSettingModule
          ),
      },
      {
        path: 'analytics',
        component: PagePowerBiComponent,
      },
      {
        path: 'seat-view/:id',
        component: PageViewSeatComponent,
        data: {location: 'seat'}
      },
      {
        path: 'seat-view',
        component: PageViewSeatScheduleComponent,
        data: {location: 'seat'}
      },
      {
        path: 'dashboard',
        data: {location: 'dashboard_report'},
        loadChildren: () => import('./page-dashboard/site-admin-page-dashboard.module').then(m => m.SitAdminPageDashboardModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteAdminRoutingModule {}
