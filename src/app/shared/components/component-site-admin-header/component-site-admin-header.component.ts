import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, AdminAuthService } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-component-site-admin-header',
  templateUrl: './component-site-admin-header.component.html',
  styleUrls: ['./component-site-admin-header.component.scss'],
})
export class ComponentSiteAdminHeaderComponent implements OnInit {
  isFromProviderSite: boolean;
  userDetails$: any;

  constructor(private _router: Router, private userService: UserService, private adminAuthService: AdminAuthService) {
    this.isFromProviderSite = this.adminAuthService.isProviderAdmin();
  }

  ngOnInit(): void {
    this.userDetails$ = this.userService._userProfile;
  }

  recipentLogIn() {
    window.open(
      'https://vms.auth.ap-south-1.amazoncognito.com/login?client_id=6nth7ffvec85nllqmdimdnd8ph&response_type=token&redirect_uri=http://localhost:4200/home',
    );
  }

  logout() {
    this.adminAuthService.adminSignOut();
  }
  logo = environment.logoImg;
}
