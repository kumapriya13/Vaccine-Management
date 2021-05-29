import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminEditorComponent } from './admin-editor/admin-editor.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { PageUsersComponent } from './page-users.component';
import { RecipientListComponent } from './recipient-list/recipient-list.component';
import { RecipientEditorComponent } from './recipient-editor/recipient-editor.component';
import { RecipientRegisterNextComponent } from './recipient-register-next/recipient-register-next.component';

const routes: Routes = [
  {
    path: '',
    component: PageUsersComponent,
    data: { location: "user_listing" },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'admins' },
      { path: 'admins', component: AdminListComponent },
      { path: 'recipients', component: RecipientListComponent },
    ],
  },
  {
    path: 'recipient/next',
    component: RecipientRegisterNextComponent,
  },
  {
    path: 'recipient/register',
    component: RecipientEditorComponent,
  },
  {
    path: 'recipient/edit/:id',
    component: RecipientEditorComponent,
  },
  {
    path: ':adminType/register',
    component: AdminEditorComponent,
  },
  {
    path: ':adminType/update/:id',
    component: AdminEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageUsersRoutingModule {}
