import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageDataProtectionComponent } from './page-data-protection/page-data-protection.component';

const routes: Routes = [
  { path: '', component: PageDataProtectionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataProtectionRoutingModule { }
