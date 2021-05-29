import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule } from './help-routing.module';
import { PageHelpComponent } from './page-help/page-help.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PageHelpComponent],
  imports: [
    CommonModule,
    SharedModule,
    HelpRoutingModule
  ]
})
export class HelpModule { }
