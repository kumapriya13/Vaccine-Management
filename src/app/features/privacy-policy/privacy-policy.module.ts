import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PagePrivacyPolicyComponent } from './page-privacy-policy/page-privacy-policy.component';


@NgModule({
  declarations: [PagePrivacyPolicyComponent],
  imports: [
    CommonModule,
    SharedModule,
    PrivacyPolicyRoutingModule
  ]
})
export class PrivacyPolicyModule { }
