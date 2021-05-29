import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RecipientAuthService } from '../../core';

@Injectable()
export class ErrorRecipientInterceptor implements HttpInterceptor {
    constructor(private _providerRecipientAuthService: RecipientAuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this._providerRecipientAuthService.recipientSignOut();
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
