import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../../shared/shared.module';
import { FamilyAddComponent } from './family-list/family-add/family-add.component';
import { FamilyListComponent } from './family-list/family-list.component';
import { PageFamilyComponent } from './page-family.component';
import { RecipientEditorComponent } from './recipient-editor/recipient-editor.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PageFamilyComponent,
    children: [
      { path: '', component: FamilyListComponent, data: {location: 'family'} },
      { path: 'register', component: RecipientEditorComponent, data: {location: ['family','recipient_registration']} },
      { path: 'edit/:id', component: RecipientEditorComponent, data: {location: 'family'} },
    ],
  },
];

@NgModule({
  declarations: [PageFamilyComponent, FamilyListComponent, RecipientEditorComponent, FamilyAddComponent],
  imports: [CommonModule, SharedModule, NgbModalModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PageFamilyModule {}
