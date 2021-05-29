import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityAdminComponent } from './facility-admin.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageManageSiteComponent } from './page-manage-site/page-manage-site.component';
import { PageManageVaccineComponent } from './page-manage-vaccine/page-manage-vaccine.component';
import { PageManageAdminComponent } from './page-manage-admin/page-manage-admin.component';
import { PageTabSiteAdminComponent } from './page-manage-admin/page-tab-site-admin/page-tab-site-admin.component';
import { PageTabVaccinatorComponent } from './page-manage-admin/page-tab-vaccinator/page-tab-vaccinator.component';
import { PageManageCalenderComponent } from './page-manage-calender/page-manage-calender.component';
import { PageManageSiteFormComponent } from './page-manage-site-form/page-manage-site-form.component';

const routes: Routes = [
  {
    path: '',
    component: FacilityAdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: PageDashboardComponent },
      { path: 'manage-site', component: PageManageSiteComponent },
      { path: 'manage-site/add-site', component: PageManageSiteFormComponent },
      { path: 'manage-site/edit-site', component: PageManageSiteFormComponent },
      { path: 'manage-vaccine', component: PageManageVaccineComponent },
      { path: 'manage-admin', component: PageManageAdminComponent },
      { path: 'manage-site-admin', component: PageTabSiteAdminComponent },
      { path: 'manage-vaccinator', component: PageTabVaccinatorComponent },
      { path: 'manage-calender', component: PageManageCalenderComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityAdminRoutingModule { }
