import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AdverseEventReportingComponent } from './adverse-event-reporting.component';

@NgModule({
  declarations: [AdverseEventReportingComponent],
  imports: [ CommonModule, SharedModule ],
  exports: [AdverseEventReportingComponent],
  providers: [],
})
export class AdverseEventReportingModule {}
