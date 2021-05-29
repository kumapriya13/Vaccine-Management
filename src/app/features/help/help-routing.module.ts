import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHelpComponent } from './page-help/page-help.component';

const routes: Routes = [
  { path: '', component:  PageHelpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
