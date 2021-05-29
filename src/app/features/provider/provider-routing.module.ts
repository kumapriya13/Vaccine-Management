import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageProviderComponent } from './page-provider/page-provider.component';
import { ProviderMeComponent } from './provider-me/provider-me.component';
import { ProviderSiteNewComponent } from './provider-site-new/provider-site-new.component';
import { ProviderSiteComponent } from './provider-site/provider-site.component';
import { ProviderResolver } from './provider.resolver';

const routes: Routes = [
  {
    path: '',
    component: PageProviderComponent,
    resolve: { provider: ProviderResolver },

    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PageDashboardComponent },
      { path: 'me', component: ProviderMeComponent },
      {
        path: 'users',
        loadChildren: () =>
          import('../../pages/page-users/page-users.module').then(
            (m) => m.PageUsersModule
          ),
      },
      {
        path: 'site',
        data: { location: "manage_site" },
        component: ProviderSiteComponent,
      },
      {
        path: 'site/create',
        data: { location: "manage_site" },
        component: ProviderSiteNewComponent,
      },
      {
        path: 'site/edit/:id',
        data: { location: "manage_site" },
        component: ProviderSiteNewComponent,
      },

      {
        path: 'notification',
        loadChildren: () =>
          import(
            '../site-admin/notification-setting/notification-setting.module'
          ).then((m) => m.NotificationSettingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule {}
