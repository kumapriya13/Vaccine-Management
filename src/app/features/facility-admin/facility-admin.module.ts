import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { FacilityAdminRoutingModule } from './facility-admin-routing.module';
import { FacilityAdminComponent } from './facility-admin.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageManageSiteComponent } from './page-manage-site/page-manage-site.component';
import { PageManageVaccineComponent } from './page-manage-vaccine/page-manage-vaccine.component';
import { PageManageAdminComponent } from './page-manage-admin/page-manage-admin.component';
import { PageTabSiteAdminComponent } from './page-manage-admin/page-tab-site-admin/page-tab-site-admin.component';
import { PageTabVaccinatorComponent } from './page-manage-admin/page-tab-vaccinator/page-tab-vaccinator.component';
import { PageManageCalenderComponent } from './page-manage-calender/page-manage-calender.component';
import { PageManageSiteFormComponent } from './page-manage-site-form/page-manage-site-form.component';

@NgModule({
  declarations: [FacilityAdminComponent, PageDashboardComponent, PageManageSiteComponent, PageManageVaccineComponent, PageManageAdminComponent, PageTabSiteAdminComponent, PageTabVaccinatorComponent, PageManageCalenderComponent, PageManageSiteFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    FacilityAdminRoutingModule
  ]
})
export class FacilityAdminModule { }
