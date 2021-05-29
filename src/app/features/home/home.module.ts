import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { PageHomeComponent } from './page-home/page-home.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HomeComponent } from './home.component';
import { PageAboutUsComponent } from './page-about-us/page-about-us.component';

@NgModule({
  declarations: [HomeComponent,PageHomeComponent,PageAboutUsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HomeRoutingModule,
    GoogleMapsModule
  ]
})
export class HomeModule { }
