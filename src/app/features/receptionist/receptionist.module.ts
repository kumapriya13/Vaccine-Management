import { NgModule } from '@angular/core';
import { ReceptionistComponent } from './receptionist.component';
import { PageUserIdComponent } from './page-user-id/page-user-id.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ReceptionistRoutingModule } from './receptionist-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageEditRecipientDetailsComponent } from './page-edit-recipient-details/page-edit-recipient-details.component';
import { PageAppointmentListComponent } from './page-appointment-list/page-appointment-list.component';
import { PageLogInComponent } from './page-log-in/page-log-in.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageScheduleComponent } from './page-schedule/page-schedule.component';
import { PageChecklistComponent } from './page-checklist/page-checklist.component';
import { PageRecipientDetailsComponent } from './page-recipient-details/page-recipient-details.component';
import { PageWalkInComponent } from './page-walk-in/page-walk-in.component';
import { PageNewRecipientRegistrationComponent } from './page-new-recipient-registration/page-new-recipient-registration.component';
import { PageBookAppointmentComponent } from './page-book-appointment/page-book-appointment.component';
import { PageScanQRCodeComponent } from './page-scan-qrcode/page-scan-qrcode.component';
import { PageEditWalkinuserComponent } from './page-edit-walkinuser/page-edit-walkinuser.component'
import { PageRecipientAppointmentComponent } from './page-recipient-appointment/page-recipient-appointment.component';

@NgModule({
  declarations: [
    ReceptionistComponent,
    PageUserIdComponent,
    PageEditRecipientDetailsComponent,
    PageAppointmentListComponent,
    PageLogInComponent,
    PageDashboardComponent,
    PageScheduleComponent,
    PageChecklistComponent,
    PageRecipientDetailsComponent,
    PageWalkInComponent,
    PageNewRecipientRegistrationComponent,
    PageBookAppointmentComponent,
    PageEditWalkinuserComponent,
    PageScanQRCodeComponent,
    PageRecipientAppointmentComponent,
    PageEditWalkinuserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReceptionistRoutingModule
  ],
  providers: [DatePipe]
})
export class ReceptionistModule { }
