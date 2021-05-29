import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageLocationAddStateComponent } from './page-location/page-location-add-state/page-location-add-state.component';
import { PageLocationComponent } from './page-location/page-location.component';
import { PageNewQuestionnaireComponent } from './page-questionnaire-builder/page-new-questionnaire/page-new-questionnaire.component';
import { PageQuestionnaireBuilderComponent } from './page-questionnaire-builder/page-questionnaire-builder.component';
import { PageViewQuestionnaireComponent } from './page-questionnaire-builder/page-view-questionnaire/page-view-questionnaire.component';
import { ProviderCreateComponent } from './provider-create/provider-create.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { SuperAdminComponent } from './super-admin.component';
import { VaccineListComponent } from './vaccine-list/vaccine-list.component';
import { VaccineRegisterComponent } from './vaccine-register/vaccine-register.component';


const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: PageDashboardComponent,
      },
      {
        path: 'users',
        loadChildren: () => import('../../pages/page-users/page-users.module').then(m => m.PageUsersModule),
      },
      {
        path: 'sites',
        data: { location: "manage_site" },
        loadChildren: () => import('./page-sites/page-sites.module').then(m => m.PageSitesModule),
      },
      {
        path: 'vaccine-register',
        component: VaccineRegisterComponent,
      },
      {
        path: 'vaccine-update/:id',
        component: VaccineRegisterComponent,
      },
      {
        path: 'vaccine-list',
        component: VaccineListComponent,
      },
      {
        path: 'vaccine-update',
        component: VaccineListComponent,
      },
      {
        path: 'provider-list',
        component: ProviderListComponent,
      },
      {
        path: 'provider-create',
        component: ProviderCreateComponent,
      },
      {
        path: 'provider-update/:id',
        component: ProviderCreateComponent,
      },
      {
        path: 'provider',
        component: ProviderListComponent,
      },
      {
        path: 'location',
        component: PageLocationComponent,
      },
      {
        path: 'location-add-state',
        component: PageLocationAddStateComponent,
      },
      {
        path: 'questionnaire-builder',
        component: PageQuestionnaireBuilderComponent
      },
      {
        path: 'new-questionnaire',
        component: PageNewQuestionnaireComponent
      },
      {
        path: 'view-questionnaire/:id',
        component: PageViewQuestionnaireComponent
      },
      { path: 'notification-setting',
        loadChildren: () => import('../site-admin/notification-setting/notification-setting.module').then((m) => m.NotificationSettingModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
