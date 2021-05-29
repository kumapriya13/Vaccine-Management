import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminTypes, ROUTE } from '../../constants';
import { AdminAuthService } from '../auth';

@Injectable({
  providedIn: 'root',
})
export class AdminRouteGuard implements CanActivate {
  constructor(private adminAuthService: AdminAuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.root.firstChild.routeConfig.path;
    const adminType = this.adminAuthService.getAdminType();

    let hasPermission = !!adminType;

    if (hasPermission) {
      switch (url) {
        case ROUTE[AdminTypes.superAdmin]:
          hasPermission = adminType === AdminTypes.superAdmin;
          break;
        case ROUTE[AdminTypes.providerAdmin]:
          hasPermission = adminType === AdminTypes.providerAdmin;
          break;
        case ROUTE[AdminTypes.facilityAdmin]:
          hasPermission = true;
          break;
        case ROUTE[AdminTypes.siteAdmin]:
          hasPermission = adminType === AdminTypes.providerAdmin || adminType === AdminTypes.siteAdmin;
          break;
        case ROUTE[AdminTypes.vaccinator]:
          hasPermission = adminType === AdminTypes.vaccinator;
          break;
        case ROUTE[AdminTypes.receptionist]:
          hasPermission = adminType === AdminTypes.receptionist;
          break;
      }
    }

    if (!hasPermission) {
      if (adminType && ROUTE[adminType]) {
        // If admin user tries to access to other admin role page that he has no access, return to his default page.
        this.router.navigateByUrl(ROUTE[adminType]);
      } else {
        localStorage.clear();
        this.router.navigateByUrl('/');
      }
    }

    return hasPermission;
  }
}
