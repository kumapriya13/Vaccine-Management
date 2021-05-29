import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from './format-date.pipe';

@NgModule({
  declarations: [FormatDatePipe],
  imports: [CommonModule],
  exports: [FormatDatePipe],
  providers: [],
})
export class PipeModule {}
