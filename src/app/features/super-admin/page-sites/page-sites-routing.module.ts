import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageSitesComponent } from './page-sites.component';
import { SiteEditorComponent } from './site-editor/site-editor.component';

const routes: Routes = [
  { path: '', component: PageSitesComponent },
  { path: 'create', component: SiteEditorComponent },
  { path: 'edit/:id', component: SiteEditorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSitesRoutingModule {}
