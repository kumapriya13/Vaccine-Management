import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageAboutUsComponent } from './page-about-us/page-about-us.component';
import { PageHomeComponent } from './page-home/page-home.component';

const routes: Routes = [
  {
  path: "",
  component: HomeComponent,
  children: [
  { path: '',pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: PageHomeComponent },
  { path: 'about-us', component: PageAboutUsComponent }
      ]
    }
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
