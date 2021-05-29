import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DataProtectionRoutingModule } from './data-protection-routing.module';
import { PageDataProtectionComponent } from './page-data-protection/page-data-protection.component';


@NgModule({
  declarations: [PageDataProtectionComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataProtectionRoutingModule
  ]
})
export class DataProtectionModule { }
