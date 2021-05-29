import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetryBackoffConfig } from 'backoff-rxjs';
import { defer, iif, Observable, of, throwError, timer } from 'rxjs';
import { catchError, concatMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { NotificationService } from '../../../shared/services/notification.service';
import { AuthManageService } from '../auth';
import { expRetryConfig } from './expotential-retry-config';
import { BackOffService } from './backoff.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authManageService: AuthManageService,
    private http: HttpClient,
    private notificaitonService: NotificationService,
    private backoffService: BackOffService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.authManageService.loadAuth();

    if (auth?.jwt) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${auth.jwt}`,
        },
      });
    }
    return next.handle(request).pipe(
      retryBackoff(expRetryConfig, this.backoffService),
      catchError((error) => this.handleHttpError(error, request, next)),
    );
  }

  private handleHttpError(error: any | Response, request: HttpRequest<any>, next: HttpHandler) {
    if (error.status === 401) {
      const refresh_token = this.authManageService.loadAuth()?.refresh_token;

      if (refresh_token) {
        const url = `${environment.apiUrl}${this.authManageService.isRecipientUser() ? 'login' : 'admin'}/refreshToken`;
        return this.http
          .post<any>(url, {
            refresh_token,
          })
          .pipe(
            switchMap(({ access_token, jwt }) => {
              this.authManageService.saveToken(access_token, jwt, refresh_token);

              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${jwt}`,
                },
              });

              return next.handle(request);
            }),
            catchError((error) => {
              this.authManageService.logout();
              return throwError(error);
            }),
          );
      } else {
        this.authManageService.logout();
      }
    } else if (error.status === 400) {
      if (error.error?.message) {
        console.log('error', error);
        this.notificaitonService.showNotification(error.error?.message,'top','error');
      }
    }

    return error.status > 399 ? throwError(error) : of(error);
  }
}

export function retryBackoff(
  config: number | RetryBackoffConfig,
  backoffService: BackOffService,
): <T>(source: Observable<T>) => Observable<T> {
  const {
    initialInterval,
    maxRetries = Infinity,
    maxInterval = Infinity,
    shouldRetry = () => true,
    resetOnSuccess = false,
    backoffDelay = exponentialBackoffDelay,
  } = typeof config === 'number' ? { initialInterval: config } : config;
  return <T>(source: Observable<T>) =>
    defer(() => {
      let index = 0;
      return source.pipe(
        retryWhen<T>((errors) =>
          errors.pipe(
            concatMap((error) => {
              const attempt = index++;
              const nextRetryInterval = getDelay(backoffDelay(attempt, initialInterval), maxInterval);
              return iif(
                () => {
                  const retry = attempt < maxRetries && shouldRetry(error);

                  if (retry) {
                    backoffService.updateBackOffStatus('retrying', nextRetryInterval);
                  }

                  return retry && backoffService.backoffEnabled;
                },
                timer(nextRetryInterval),
                throwError(error),
              );
            }),
            tap({ error: () => backoffService.updateBackOffStatus('fail', null) }),
          ),
        ),
        tap({
          complete: () => {
            index > 0 && backoffService.updateBackOffStatus('success', null);
          },
        }),
      );
    });
}
/** Calculates the actual delay which can be limited by maxInterval */
export function getDelay(backoffDelay: number, maxInterval: number) {
  return Math.min(backoffDelay, maxInterval);
}

/** Exponential backoff delay */
export function exponentialBackoffDelay(iteration: number, initialInterval: number) {
  return Math.pow(2, iteration) * initialInterval;
}
