import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ProviderService } from '../../core';
import { AuthManageService } from '../../core/services/auth/auth-manage.service';
import { map } from 'rxjs/operators';
import { ProviderAdminPageService } from './provider-admin-page.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderResolver implements Resolve<any> {
  constructor(
    private providerService: ProviderService,
    private providerPageService: ProviderAdminPageService,
    private router: Router,
    private authManageService: AuthManageService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const providerId = this.authManageService.getLoggedInUser()?.provider_id;

    if (providerId) {
      return this.providerService.get(providerId).pipe(
        map((provider) => {
          this.providerPageService.setProvider(provider);
          if (provider) {
            this.authManageService.setLoggedInUser({
              ...this.authManageService.getLoggedInUser(),
              ...{ provider }
            })
            return provider;
          } else {
            this.router.navigateByUrl('/');
          }
        }),
      );
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
