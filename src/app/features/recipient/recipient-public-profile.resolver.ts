import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RecipientService } from '../../core';

@Injectable({
  providedIn: 'root',
})
export class RecipientPublicProfileGuard implements Resolve<any> {
  constructor(private recipientService: RecipientService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    // const recipientUrl = 'https://dal85p7xe8cc6.cloudfront.net/recipient/1/f948bd2e-057e-49e0-995e-17a3c3e21ac5';
    // const recipientUrl = 'https://dal85p7xe8cc6.cloudfront.net/recipient/1/a047140b-0eed-43a0-a62c-751dfe7b0c83';
    // const recipientUrl = 'https://2120check.com/recipient/123894193451';
    const recipientUrl = window.location.href;

    return this.recipientService.getPublicViewProfile(recipientUrl).pipe(
      map((profile) => {
        return { recipientUrl, profile };
      }),
      catchError((err) => {
        this.router.navigate([]);

        return throwError(err);
      }),
    );
  }
}
