import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageLocationAddStateComponent } from './page-location/page-location-add-state/page-location-add-state.component';
import { PageLocationComponent } from './page-location/page-location.component';
import { PageNewQuestionnaireComponent } from './page-questionnaire-builder/page-new-questionnaire/page-new-questionnaire.component';
import { PageQuestionnaireBuilderComponent } from './page-questionnaire-builder/page-questionnaire-builder.component';
import { PageViewQuestionnaireComponent } from './page-questionnaire-builder/page-view-questionnaire/page-view-questionnaire.component';
import { EditQuestionDialog } from './page-questionnaire-builder/page-view-questionnaire/edit-questionnaire-dialog/edit-question-dialog';
import { ProviderCreateComponent } from './provider-create/provider-create.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { QuestionBuilderBlockComponent } from './page-questionnaire-builder/question-builder-block/question-builder-block.component';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminComponent } from './super-admin.component';
import { VaccineListComponent } from './vaccine-list/vaccine-list.component';
import { VaccineRegisterComponent } from './vaccine-register/vaccine-register.component';
import { UiKitModule } from 'src/app/ui-kit/ui-kit.module';

@NgModule({
  declarations: [
    SuperAdminComponent,
    VaccineRegisterComponent,
    VaccineListComponent,
    ProviderListComponent,
    ProviderCreateComponent,
    PageLocationComponent,
    PageLocationAddStateComponent,
    PageDashboardComponent,
    PageQuestionnaireBuilderComponent,
    PageNewQuestionnaireComponent,
    QuestionBuilderBlockComponent,
    PageViewQuestionnaireComponent,
    EditQuestionDialog
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    SharedModule,
    UiKitModule
  ]
})


export class SuperAdminModule { }
