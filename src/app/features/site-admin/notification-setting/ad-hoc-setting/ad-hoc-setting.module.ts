import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { NgbAccordionModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from 'src/app/shared/shared.module';

import { AdHocEditorComponent } from './ad-hoc-editor/ad-hoc-editor.component';
import { RecipientListGridComponent } from './ad-hoc-editor/recipient-list-grid.component';
import { AdHocListComponent } from './ad-hoc-list/ad-hoc-list.component';
import { NotificationContentComponent } from './ad-hoc-list/notification-content.component';
import { AdHocSettingComponent } from './ad-hoc-setting.component';
import { AdHocTimeScheduleComponent } from './ad-hoc-time-schedule/ad-hoc-time-schedule.component';
import { RecipientFieldSelectorComponent } from './recipient-field-selector/recipient-field-selector.component';
import { RecipientFilterComponent } from './recipient-filter/recipient-filter.component';

const routes: Routes = [
  {
    path: '',
    component: AdHocSettingComponent,
    children: [
      { path: '', component: AdHocListComponent },
      { path: 'new', component: AdHocEditorComponent },
      { path: 'resend/:id', component: AdHocEditorComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AdHocSettingComponent,
    AdHocListComponent,
    AdHocEditorComponent,
    RecipientFilterComponent,
    RecipientFieldSelectorComponent,
    RecipientListGridComponent,
    NotificationContentComponent,
    AdHocTimeScheduleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
    SharedModule,
    MatMenuModule,
    NgbPaginationModule,
    NgbAccordionModule,
    NgSelectModule
  ],
})
export class AdHocSettingModule {}
