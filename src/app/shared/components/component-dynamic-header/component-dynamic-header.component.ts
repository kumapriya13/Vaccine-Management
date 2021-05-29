import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { AdminTypes } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { AdminAuthService } from '../../../core';
import { retriveMenuFromAdminType, RoutePath } from '../../../core/routes';

@Component({
  selector: 'app-component-dynamic-header',
  templateUrl: './component-dynamic-header.component.html',
  styleUrls: ['./component-dynamic-header.component.scss'],
})
export class ComponentDynamicHeaderComponent implements OnInit {
  dynamicMenu: RoutePath[] = [];
  adminProfile$!: Observable<any>;

  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.loadAdminType(_.nth(this.router.url.split('/'), 1));
  }

  loadAdminType = (segment: string) => {
    switch (segment) {
      case 'provider':
        this.adminProfile$ = of(JSON.parse(localStorage.getItem(AdminTypes.providerAdmin)));
        this.dynamicMenu = retriveMenuFromAdminType(AdminTypes.providerAdmin);
        break;
      default:
         this.adminProfile$ = of(JSON.parse(localStorage.getItem(AdminTypes.providerAdmin)));
         this.dynamicMenu = retriveMenuFromAdminType(AdminTypes.providerAdmin);
        break;
    }
  };

  logout = () => {
    this.adminAuthService.adminSignOut();
  };
  logo = environment.logoImg;
}
