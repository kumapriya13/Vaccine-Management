import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { SharedModule } from '../../../shared/shared.module';
import { NotificaionSettingComponent } from './notificaion-setting.component';
import { NotificationSettingRoutingModule } from './notification-setting-routing.module';

@NgModule({
  declarations: [NotificaionSettingComponent],
  imports: [CommonModule, SharedModule, NotificationSettingRoutingModule, MatChipsModule],
})
export class NotificationSettingModule {}
