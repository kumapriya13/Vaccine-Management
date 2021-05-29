import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UiKitModule } from 'src/app/ui-kit/ui-kit.module';

import { SharedModule } from '../../../shared/shared.module';
import { PageSitesRoutingModule } from './page-sites-routing.module';
import { PageSitesComponent } from './page-sites.component';
import { SiteEditorComponent } from './site-editor/site-editor.component';

@NgModule({
  declarations: [PageSitesComponent, SiteEditorComponent],
  imports: [CommonModule, PageSitesRoutingModule, SharedModule, NgbPaginationModule, UiKitModule],
})
export class PageSitesModule {}
