import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../app/shared';
import { PageDashboardAppointmentsComponent } from './appointments/page-dashboard-appointments.component';
import { PageDashboardVaccinatorsComponent } from './vaccinators/page-dashboard-vaccinators.component';
import { PageDashboardTabComponent } from './tabs/page-dashboard-tab.component';
import { PageDashboardComponent } from './page-dashboard.component';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    PageDashboardAppointmentsComponent,
    PageDashboardVaccinatorsComponent,
    PageDashboardTabComponent,
    ScheduleComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PageDashboardComponent,
        children: [
          {
            path: '',
            redirectTo: 'appointments',
            pathMatch: 'full',
          },
          {
            path: 'appointments',
            component: PageDashboardAppointmentsComponent,
          },
          {
            path: 'vaccinators',
            component: PageDashboardVaccinatorsComponent,
          },
          {
            path: 'schedule',
            component: ScheduleComponent,
          },
        ],
      },
    ]),
    CommonModule,
  ],
})
export class SitAdminPageDashboardModule {}
