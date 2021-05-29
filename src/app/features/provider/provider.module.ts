import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProviderRoutingModule } from './provider-routing.module';
import { PageProviderComponent } from './page-provider/page-provider.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { ProviderMeComponent } from './provider-me/provider-me.component';
import { ProviderSiteComponent } from './provider-site/provider-site.component';
import { ProviderSiteNewComponent } from './provider-site-new/provider-site-new.component';
@NgModule({
  declarations: [
    PageProviderComponent,
    PageDashboardComponent,
    ProviderMeComponent,
    ProviderSiteComponent,
    ProviderSiteNewComponent,
  ],
  imports: [CommonModule, SharedModule, ProviderRoutingModule],
})
export class ProviderModule {}
