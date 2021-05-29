import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import { ComponentFacilityAdminHeaderComponent } from './components/component-facility-admin-header/component-facility-admin-header.component';
import { ComponentFooterCopyrightStripComponent } from './components/component-footer-copyright-strip/component-footer-copyright-strip.component';
import { ComponentFooterComponent } from './components/component-footer/component-footer.component';
import { ComponentHeaderComponent } from './components/component-header/component-header.component';
import { ComponentReceptionistHeaderComponent } from './components/component-receptionist-header/component-receptionist-header.component';
import { ComponentRecipientHeaderComponent } from './components/component-recipient-header/component-recipient-header.component';
import { ComponentSiteAdminHeaderComponent } from './components/component-site-admin-header/component-site-admin-header.component';
import { ComponentSuperAdminHeaderComponent } from './components/component-super-admin-header/component-super-admin-header.component';
import { ComponentUserStaticQuestionnaireComponent } from './components/component-user-static-questionnaire/component-user-static-questionnaire.component';
import { ComponentVaccinatorHeaderComponent } from './components/component-vaccinator-header/component-vaccinator-header.component';
import { ComponentVaccineRecipientAndProviderAuthBannerComponent } from './components/component-vaccine-recipient-and-provider-auth-banner/component-vaccine-recipient-and-provider-auth-banner.component';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { ModalReceipentPreviewComponent } from './modals/modal-receipent-preview/modal-receipent-preview.component';
import { ModalTermsOfUseComponent } from './modals/modal-terms-of-use/modal-terms-of-use.component';
import { MaterialModule } from './modules/material-module';
import { SortByPipe } from './pipes/sortBy';
import { CountriesService } from './services/countries.service';
import { NotificationService } from './services/notification.service';
import { SeatDateRangeService } from './services/seat.date.range.service';
import { ConfirmEqualValidatorDirective } from './helpers/confirmPasswordValidation';
import { ModalDataProtectionComponent } from './modals/modal-data-protection/modal-data-protection.component';
import { ModalPrivacyPolicyComponent } from './modals/modal-privacy-policy/modal-privacy-policy.component';
import { ModalPreviewCertificateComponent } from './modals/modal-preview-certificate/modal-preview-certificate.component';
import { ModelBookSelectedAppointmentsComponent } from './modals/model-book-selected-appointments/model-book-selected-appointments.component';
import { ComponentDynamicHeaderComponent } from './components/component-dynamic-header/component-dynamic-header.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WaitingRoomDialogComponent } from './modals/waiting-room-dialog/waiting-room-dialog.component';
import { PipeModule } from './pipes/pipe.module';
import { VmsTooltipDirective } from 'src/app/shared/directive/vms-tooltip.directive';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ComponntRecipientVisitComponent } from './components/component-recipient-visit/component-recipient-visit.component';
import { ComponentHeadingComponent } from './components/component-heading/component-heading.component';
import { SafePipe } from './pipes/safe.pipe';
import { ComponentHelpComponent } from './components/component-help/component-help.component';
import { UnSavedChangesGuard } from '../core/services/route-guards/unsaved-changes.guard';
import { ComponentCommonModelComponent } from './components/component-common-model/component-common-model.component';
import { ComponentManageScheduleComponent } from '../shared/components/component-manage-schedule/component-manage-schedule.component';
import { BookAppointmentSharedComponent } from './components/book-appointment/book-appointment-shared.component';
import { EditRecepientCommonComponent } from './components/edit-recepient-common/edit-recepient-common.component';
import { RecipientInviteFormComponent } from './components/recipient-invite-form/recipient-invite-form.component';
import { AdminRecipientInviteFormComponent } from './components/admin-recipient-invite-form/recipient-invite-form.component';
import { DatePipe } from '@angular/common';

const componentExportArr = [
  ComponentHeaderComponent,
  ComponentRecipientHeaderComponent,
  ComponentVaccinatorHeaderComponent,
  ComponentFooterComponent,
  ComponentFooterCopyrightStripComponent,
  ComponentVaccineRecipientAndProviderAuthBannerComponent,
  ConfirmationAlertComponent,
  ComponentFacilityAdminHeaderComponent,
  ComponentSiteAdminHeaderComponent,
  ConfirmEqualValidatorDirective,
  SortByPipe,
  ComponentSuperAdminHeaderComponent,
  ComponentReceptionistHeaderComponent,
  ComponentUserStaticQuestionnaireComponent,
  ComponentDynamicHeaderComponent,
  ComponntRecipientVisitComponent,
  RecipientInviteFormComponent,
  AdminRecipientInviteFormComponent,

  ModalReceipentPreviewComponent,
  ModalDataProtectionComponent,
  ModalPrivacyPolicyComponent,
  ModalTermsOfUseComponent,
  ModalPreviewCertificateComponent,
  ModelBookSelectedAppointmentsComponent,
  WaitingRoomDialogComponent,
  VmsTooltipDirective,
  SafePipe,
  ComponentHeadingComponent,
  ComponentHelpComponent,
  ComponentCommonModelComponent,
  ComponentManageScheduleComponent,
  BookAppointmentSharedComponent,
  EditRecepientCommonComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,
    MaterialModule,
    Ng2TelInputModule,
    NgxMaterialTimepickerModule,
    NgbPaginationModule,
    NgxSpinnerModule,
    PipeModule,
    ZXingScannerModule,
    NgSelectModule
  ],
  declarations: componentExportArr,
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,
    MaterialModule,
    Ng2TelInputModule,
    NgxMaterialTimepickerModule,
    NgbPaginationModule,
    NgxSpinnerModule,
    PipeModule,
    ZXingScannerModule,
    [...componentExportArr],
  ],
  providers: [DatePipe,NotificationService, CountriesService, SeatDateRangeService,UnSavedChangesGuard],
})
export class SharedModule { }
