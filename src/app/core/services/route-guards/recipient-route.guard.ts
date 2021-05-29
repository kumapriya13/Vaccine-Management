import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { RecipientAuthService } from '../auth';

@Injectable({
  providedIn: 'root',
})
export class RecipientRouteGuard implements CanActivate {
  constructor(private recipientAuthService: RecipientAuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const pathname = window.location.pathname;

    if (pathname.startsWith('/recipient/public')) {
      return true;
    } else {
      const canNavigate = !!this.recipientAuthService.currentRecipientValue;
      if (!canNavigate) {
        localStorage.clear();
        this.router.navigateByUrl('/');
      }

      return canNavigate;
    }
  }
}
