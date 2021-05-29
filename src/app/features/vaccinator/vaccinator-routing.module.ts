import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VaccinatorComponent } from './vaccinator.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageScheduleComponent } from './page-schedule/page-schedule.component';
import { PageChecklistComponent } from './page-checklist/page-checklist.component';
import { PageHistoryComponent } from './page-history/page-history.component';
import { PageRecipientDetailsComponent } from './page-recipient-details/page-recipient-details.component';
import { AdverseEventReportingComponent } from './adverse-event-reporting/adverse-event-reporting.component';
import {ViewRecepientComponent} from './view-recepient/view-recepient.component'
import { ReceptionistComponent } from '../receptionist/receptionist.component';
import {PageRecipientAppointmentComponent} from './page-recipient-appointment/page-recipient-appointment.component'
import { PageScanQRCodeComponent } from './page-scan-qrcode/page-scan-qrcode.component';
import { UnSavedChangesGuard } from '../../core/services/route-guards/unsaved-changes.guard'
const routes: Routes = [
  {
    path: '',
    component: VaccinatorComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: PageDashboardComponent },
      { path: 'schedule', component: PageScheduleComponent, data: { location: "todays_schedule" } },
      { path: 'checklist/:id/:type/:isValidated', component: PageChecklistComponent, canDeactivate: [UnSavedChangesGuard]},
      { path: 'history', component: PageHistoryComponent },
      { path: 'recepient/:id/:type', component: PageRecipientDetailsComponent,canDeactivate: [UnSavedChangesGuard] },
      { path: 'advert-event/:id/:fromPage', component: AdverseEventReportingComponent },
      { path: 'view-recepient/:id', component: ViewRecepientComponent },
      { path: 'recipient-appointment/:id', component: PageRecipientAppointmentComponent }, 
      { path: 'scan-qr-code',  component: PageScanQRCodeComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccinatorRoutingModule { }
