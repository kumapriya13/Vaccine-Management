import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/shared';
import { AdminEditorComponent } from './admin-editor/admin-editor.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { PageUsersRoutingModule } from './page-users-routing.module';
import { PageUsersComponent } from './page-users.component';
import { RecipientListComponent } from './recipient-list/recipient-list.component';
import { RecipientEditorComponent } from './recipient-editor/recipient-editor.component';
import { RecipientRegisterNextComponent } from './recipient-register-next/recipient-register-next.component';
import { UiKitModule } from 'src/app/ui-kit/ui-kit.module';
import { FiledrapanddropDirective} from '../../shared/directive/filedrapanddrop.directive';

@NgModule({
  declarations: [
    PageUsersComponent,
    AdminListComponent,
    RecipientListComponent,
    AdminEditorComponent,
    RecipientEditorComponent,
    RecipientRegisterNextComponent,
    FiledrapanddropDirective
  ],
  imports: [CommonModule, PageUsersRoutingModule, SharedModule, NgbPaginationModule, NgbModalModule, MatProgressSpinnerModule,UiKitModule],
})
export class PageUsersModule {}
