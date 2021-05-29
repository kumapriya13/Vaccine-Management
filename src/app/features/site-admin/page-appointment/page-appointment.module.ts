import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../../shared/shared.module';
import { PageAppointmentComponent } from './page-appointment.component';
import { Routes, RouterModule } from '@angular/router';
import { BulkAppointmentComponent } from './bulk-appointment/bulk-appointment.component';
import { RecipientFilterComponent } from './recipient-filter/recipient-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RecipientListGridComponent } from './recipient-filter/recipient-list-grid.component';
import { RecipientListInputComponent } from './recipient-filter/recipient-list-input.component';
import { ManagePrivateSlotsComponent } from './manage-private-slots/manage-private-slots.component';
import { QuillModule } from 'ngx-quill';
import { SitefiledrapanddropDirective} from '../../../shared/directive/sitefiledrapanddrop.directive';

const routes: Routes = [{ path: '', component: PageAppointmentComponent,data: {location: 'admin_appointment'} }];

@NgModule({
  declarations: [
    PageAppointmentComponent,
    BulkAppointmentComponent,
    RecipientFilterComponent,
    RecipientListInputComponent,
    RecipientListGridComponent,
    ManagePrivateSlotsComponent,
    SitefiledrapanddropDirective
  ],
  imports: [CommonModule, NgSelectModule, SharedModule, QuillModule.forRoot(), RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PageApointmentModule {}
