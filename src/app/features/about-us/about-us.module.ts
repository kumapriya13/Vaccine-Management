import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { PageAboutUsComponent } from './page-about-us/page-about-us.component';


@NgModule({
  declarations: [PageAboutUsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AboutUsRoutingModule
  ]
})
export class AboutUsModule { }
