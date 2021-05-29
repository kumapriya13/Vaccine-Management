import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificaionSettingComponent } from './notificaion-setting.component';

const routes: Routes = [
  {
    path: '',
    component: NotificaionSettingComponent,
    data: {location: 'adhoc_notification'},
    children: [
      {
        path: 'ad-hoc',
        loadChildren: () => import('./ad-hoc-setting/ad-hoc-setting.module').then((m) => m.AdHocSettingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationSettingRoutingModule {}
