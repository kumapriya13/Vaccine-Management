import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TermsOfUseRoutingModule } from './terms-of-use-routing.module';
import { PageTermsOfUseComponent } from './page-terms-of-use/page-terms-of-use.component';


@NgModule({
  declarations: [PageTermsOfUseComponent],
  imports: [
    CommonModule,
    SharedModule,
    TermsOfUseRoutingModule
  ]
})
export class TermsOfUseModule { }
