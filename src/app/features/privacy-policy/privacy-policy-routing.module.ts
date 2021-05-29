import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagePrivacyPolicyComponent } from './page-privacy-policy/page-privacy-policy.component';

const routes: Routes = [
  { path: '', component: PagePrivacyPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
