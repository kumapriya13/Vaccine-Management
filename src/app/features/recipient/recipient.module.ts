import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { CodeInputModule } from 'angular-code-input';

import { RecipientRoutingModule } from './recipient-routing.module';
import { RecipientComponent } from './recipient.component';
import { PageAppointmentComponent } from './page-appointment/page-appointment.component';
import { PageAppointmentStepperComponent } from './page-appointment/page-appointment-stepper/page-appointment-stepper.component';
import { PageVaccineSiteContainerComponent } from './page-appointment/page-appointment-stepper/page-vaccine-site-container/page-vaccine-site-container.component';
import { PageBookSlotComponent } from './page-appointment/page-appointment-stepper/page-book-slot/page-book-slot.component';
import { PageVaccineScheduleComponent } from './page-appointment/page-appointment-stepper/page-vaccine-schedule/page-vaccine-schedule.component';

import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageCertificateComponent } from './page-appointment/page-appointment-stepper/page-certificate/page-certificate.component';
import { PagePreVaccinationCheckListComponent } from './page-pre-vaccination-check-list/page-pre-vaccination-check-list.component';
import { PageMyPofileComponent } from './page-my-pofile/page-my-pofile.component';
import { PageHelpComponent } from './page-help/page-help.component';
import { PageNotificationComponent } from './page-notification/page-notification.component';
import { PageRegistraionFormComponent } from './page-registraion-form/page-registraion-form.component';
import { PageEditProfileComponent } from './page-edit-profile/page-edit-profile.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { PageProvidersComponent } from './providers/page-providers/page-providers.component';
import { PageRecipientAboutUsComponent } from './page-recipient-about-us/page-recipient-about-us.component';
import { PageEditScanQrComponent } from './page-edit-scan-qr/page-edit-scan-qr.component';
import { PageLinkBraceletProfileComponent } from './page-link-bracelet-profile/page-link-bracelet-profile.component';
import { PageEditScanQrPreviewComponent } from './page-edit-scan-qr-preview/page-edit-scan-qr-preview.component';
import { PageRecipientPublicProfileComponent } from './page-recipient-public-profile/page-recipient-public-profile.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import { AdverseEventReportingModule } from '../../pages/adverse-event-reporting/adverse-event-reporting.module';
import { FamilyAppointmentComponent } from './family-appointment/family-appointment.component';
@NgModule({
  declarations: [
    RecipientComponent,
    PageAppointmentComponent,
    PageAppointmentStepperComponent,
    PageVaccineSiteContainerComponent,
    PageBookSlotComponent,
    PageVaccineScheduleComponent,
    PageDashboardComponent,
    PageCertificateComponent,
    PagePreVaccinationCheckListComponent,
    PageMyPofileComponent,
    PageHelpComponent,
    PageNotificationComponent,
    PageRegistraionFormComponent,
    PageEditProfileComponent,
    PageProvidersComponent,
    PageRecipientAboutUsComponent,
    PageEditScanQrComponent,
    PageLinkBraceletProfileComponent,
    PageEditScanQrPreviewComponent,
    PageRecipientPublicProfileComponent,
    FamilyAppointmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipientRoutingModule,
    Ng2TelInputModule,
    CodeInputModule,
    AdverseEventReportingModule,
    NgbModalModule,
    GoogleMapsModule
  ],providers: [DatePipe]

})
export class RecipientModule { }
