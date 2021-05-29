import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { VaccinatorRoutingModule } from './vaccinator-routing.module';
import { VaccinatorComponent } from './vaccinator.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageScheduleComponent } from './page-schedule/page-schedule.component';
import { PageChecklistComponent } from './page-checklist/page-checklist.component';
import { PageRecipientDetailsComponent } from './page-recipient-details/page-recipient-details.component';
import { PageHistoryComponent } from './page-history/page-history.component';
import { AdverseEventReportingComponent } from './adverse-event-reporting/adverse-event-reporting.component';
import { ViewRecepientComponent } from './view-recepient/view-recepient.component'
import { PageRecipientAppointmentComponent} from './page-recipient-appointment/page-recipient-appointment.component';
import { PageScanQRCodeComponent } from './page-scan-qrcode/page-scan-qrcode.component'
 @NgModule({
  declarations: [
    VaccinatorComponent,
    PageDashboardComponent,
    PageScheduleComponent,
    PageChecklistComponent,
    PageRecipientDetailsComponent,
    PageHistoryComponent,
    AdverseEventReportingComponent,
    ViewRecepientComponent,
    PageRecipientAppointmentComponent,
    PageScanQRCodeComponent
  ],
  imports: [CommonModule, SharedModule, VaccinatorRoutingModule],
  providers: [DatePipe]
})
export class VaccinatorModule { }
