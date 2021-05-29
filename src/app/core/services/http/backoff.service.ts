import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackOffService {
  backoffStatus$ = new BehaviorSubject<{ status: 'retrying' | 'fail' | 'success'; nextRetryInterval: number }>({
    status: null,
    nextRetryInterval: null,
  });
  backoffEnabled: boolean;

  constructor() {}

  public updateBackOffStatus(status: 'retrying' | 'fail' | 'success', nextRetryInterval: number): void {
    this.backoffStatus$.next({ status, nextRetryInterval });
    if (status === 'retrying') {
      this.backoffEnabled = true;
    }
  }

  public cancelBackoffProcess(): void {
    this.backoffEnabled = false;
  }
}
