import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageTermsOfUseComponent } from './page-terms-of-use/page-terms-of-use.component';

const routes: Routes = [
  { path: '', component: PageTermsOfUseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsOfUseRoutingModule { }
