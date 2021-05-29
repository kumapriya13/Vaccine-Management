import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRouteGuard, RecipientRouteGuard, ROUTE, AdminTypes } from 'src/app/core';

const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'home'
  // },
  
  // {
  //   path: 'about-us',
  //   loadChildren: () => import('./features/about-us/about-us.module').then(m => m.AboutUsModule)
  // },
  {
    path: 'data-protection',
    loadChildren: () => import('./features/data-protection/data-protection.module').then(m => m.DataProtectionModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./features/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./features/help/help.module').then(m => m.HelpModule)
  },
  {
    path: 'terms-of-use',
    loadChildren: () => import('./features/terms-of-use/terms-of-use.module').then(m => m.TermsOfUseModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./shared/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'recipient',
    loadChildren: () => import('./features/recipient/recipient.module').then(m => m.RecipientModule),
    canActivate: [RecipientRouteGuard],
  },
  {
    path: ROUTE[AdminTypes.superAdmin],
    loadChildren: () => import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule),
    canActivate: [AdminRouteGuard]
  },
  {
    path: ROUTE[AdminTypes.providerAdmin],
    loadChildren: () => import('./features/provider/provider.module').then(m => m.ProviderModule),
    canActivate: [AdminRouteGuard]
  },
  {
    path: ROUTE[AdminTypes.facilityAdmin],
    loadChildren: () => import('./features/facility-admin/facility-admin.module').then(m => m.FacilityAdminModule),
    canActivate: [AdminRouteGuard]
  },
  {
    path: ROUTE[AdminTypes.siteAdmin],
    loadChildren: () => import('./features/site-admin/site-admin.module').then(m => m.SiteAdminModule),
    canActivate: [AdminRouteGuard]
  },
  {
    path: ROUTE[AdminTypes.vaccinator],
    loadChildren: () => import('./features/vaccinator/vaccinator.module').then(m => m.VaccinatorModule),
    canActivate: [AdminRouteGuard]
  },
  {
    path: ROUTE[AdminTypes.receptionist],
    loadChildren: () => import('./features/receptionist/receptionist.module').then(m => m.ReceptionistModule),
    canActivate: [AdminRouteGuard]
  },
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  // {
  //   path: '**',
  //   redirectTo: 'home'
  // }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
