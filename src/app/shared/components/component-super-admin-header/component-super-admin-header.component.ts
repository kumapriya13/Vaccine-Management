import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-component-super-admin-header',
  templateUrl: './component-super-admin-header.component.html',
  styleUrls: ['./component-super-admin-header.component.scss'],
})
export class ComponentSuperAdminHeaderComponent {

  constructor(
    private authManageService: AdminAuthService,
  ) {}

  logout() {
    this.authManageService.adminSignOut();
  }
  logo = environment.logoImg;
}
