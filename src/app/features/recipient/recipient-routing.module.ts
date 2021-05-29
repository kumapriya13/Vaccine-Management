import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipientComponent } from './recipient.component';
import { PageAppointmentComponent } from './page-appointment/page-appointment.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageCertificateComponent } from './page-appointment/page-appointment-stepper/page-certificate/page-certificate.component';
import { PagePreVaccinationCheckListComponent } from './page-pre-vaccination-check-list/page-pre-vaccination-check-list.component';
import { PageMyPofileComponent } from './page-my-pofile/page-my-pofile.component';
import { PageHelpComponent } from './page-help/page-help.component';
import { PageNotificationComponent } from './page-notification/page-notification.component';
import { PageRegistraionFormComponent } from './page-registraion-form/page-registraion-form.component';
import { PageEditProfileComponent } from './page-edit-profile/page-edit-profile.component';
import { PageProvidersComponent } from './providers/page-providers/page-providers.component';
import { PageRecipientAboutUsComponent } from './page-recipient-about-us/page-recipient-about-us.component';
import { PageEditScanQrComponent } from './page-edit-scan-qr/page-edit-scan-qr.component';
import { PageLinkBraceletProfileComponent } from './page-link-bracelet-profile/page-link-bracelet-profile.component';
import { PageEditScanQrPreviewComponent } from './page-edit-scan-qr-preview/page-edit-scan-qr-preview.component';
import { PageRecipientPublicProfileComponent } from './page-recipient-public-profile/page-recipient-public-profile.component';
import { RecipientPublicProfileGuard } from './recipient-public-profile.resolver';
import { AdverseEventReportingComponent } from '../../pages/adverse-event-reporting/adverse-event-reporting.component';

const routes: Routes = [
  {
    path: '',
    data: { reuse: true },
    component: RecipientComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'appointment' },
      { path: 'dashboard', data: { reuse: true }, component: PageDashboardComponent },
      { path: 'appointment', data: { reuse: true,location: ['appointment_map','appointment_booking']}, component: PageAppointmentComponent },
      { path: 'certificate', data: { reuse: true,location: 'recipient_profile' }, component: PageCertificateComponent },
      { path: 'pre-vaccinate-check-list', data: { reuse: true }, component: PagePreVaccinationCheckListComponent },
      { path: 'profile', data: { reuse: true,location: 'recipient_profile' }, component: PageMyPofileComponent },
      { path: 'profile/dependent/:id', data: { reuse: true,location: 'recipient_profile' }, component: PageMyPofileComponent },
      { path: 'edit-profile', data: { reuse: true,location: 'recipient_profile' }, component: PageEditProfileComponent },
      { path: 'edit-profile/:id', data: { reuse: true,location: 'recipient_profile' }, component: PageEditProfileComponent },
      { path: 'help', data: { reuse: true }, component: PageHelpComponent },
      { path: 'notification', data: { reuse: true }, component: PageNotificationComponent },
      { path: 'registration', data: { reuse: true }, component: PageRegistraionFormComponent },
      { path: 'providers', data: { reuse: true }, component: PageProvidersComponent },
      { path: 'page-about-us', data: { reuse: true }, component: PageRecipientAboutUsComponent },
      { path: 'edit-scan', data: { reuse: true,location: 'recipient_profile' }, component: PageEditScanQrComponent },
      { path: 'edit-scan/:id', data: { reuse: true,location: 'recipient_profile' }, component: PageEditScanQrComponent },
      { path: 'link-bracelet', data: { reuse: true }, component: PageLinkBraceletProfileComponent },
      { path: 'edit-scan-preview', data: { reuse: true,location: 'recipient_profile' }, component: PageEditScanQrPreviewComponent },
      { path: 'family', loadChildren: () => import('./page-family/page-family.module').then(m => m.PageFamilyModule) },
      { path: 'advert-event/:id/:fromPage', component: AdverseEventReportingComponent },
      {
        path: 'public/:instanceId/:id',
        data: { reuse: true },
        component: PageRecipientPublicProfileComponent,
        resolve: { data: RecipientPublicProfileGuard },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipientRoutingModule { }
