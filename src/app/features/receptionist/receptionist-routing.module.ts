import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAppointmentListComponent } from './page-appointment-list/page-appointment-list.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageEditRecipientDetailsComponent } from './page-edit-recipient-details/page-edit-recipient-details.component';
import { PageLogInComponent } from './page-log-in/page-log-in.component';
import { PageScheduleComponent } from './page-schedule/page-schedule.component';
import { PageUserIdComponent } from './page-user-id/page-user-id.component';
import { ReceptionistComponent } from './receptionist.component';
import { PageChecklistComponent } from './page-checklist/page-checklist.component';
import { PageRecipientDetailsComponent } from './page-recipient-details/page-recipient-details.component'
import { PageWalkInComponent } from './page-walk-in/page-walk-in.component';
import { PageNewRecipientRegistrationComponent } from './page-new-recipient-registration/page-new-recipient-registration.component';
import { PageBookAppointmentComponent } from './page-book-appointment/page-book-appointment.component';
import { PageEditWalkinuserComponent } from './page-edit-walkinuser/page-edit-walkinuser.component';
import { PageScanQRCodeComponent } from './page-scan-qrcode/page-scan-qrcode.component';
import { PageRecipientAppointmentComponent } from './page-recipient-appointment/page-recipient-appointment.component';
import { AdverseEventReportingComponent } from 'src/app/pages/adverse-event-reporting/adverse-event-reporting.component';
import { UnSavedChangesGuard } from 'src/app/core/services/route-guards/unsaved-changes.guard';

const routes: Routes = [
  {
    path: '', data: { reuse: true }, component: ReceptionistComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: PageDashboardComponent },
      { path: 'user-info', data: { reuse: true }, component: PageUserIdComponent },
      { path: 'edit-info/:id/:typeid', data: { reuse: true }, component: PageEditRecipientDetailsComponent },
      { path: 'log-in', data: { reuse: true }, component: PageLogInComponent },
      { path: 'appointment-list', data: { reuse: true,location: "admin_appointment" }, component: PageAppointmentListComponent },
      { path: 'schedule', component: PageScheduleComponent, data: { location: "todays_schedule" } },
      { path: 'checklist/:id/:type', component: PageChecklistComponent, canDeactivate: [UnSavedChangesGuard] },
      { path:'edit-info-user/:id',component:PageEditWalkinuserComponent},      
      { path: 'scan-qr-code',  component: PageScanQRCodeComponent},    
      { path: 'recipient-appointment/:id', component: PageRecipientAppointmentComponent },     
      { path: 'adverse-event/:id', component: AdverseEventReportingComponent },
      { path: 'walk-in', component: PageWalkInComponent, data: {location: "admin_appointment" } },      
      { path: 'new-registration', component: PageNewRecipientRegistrationComponent, data: { location: "admin_appointment" } },
      { path: 'book-appointment/:id', component:PageBookAppointmentComponent, data: { location: "admin_appointment" } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionistRoutingModule { }
