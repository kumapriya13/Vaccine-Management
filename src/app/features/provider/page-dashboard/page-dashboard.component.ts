import { Component, OnInit } from '@angular/core';

import { AuthManageService } from '../../../core';
import { ProviderAdminPageService } from '../provider-admin-page.service';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {
  loggedInUser: any;

  constructor(private authManageService: AuthManageService, private providerAdminPageService: ProviderAdminPageService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authManageService.getLoggedInUser();
  }

  get provider$(): any {
    return this.providerAdminPageService.provider$;
  }
}
