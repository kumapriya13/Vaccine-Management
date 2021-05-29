import { Injectable } from '@angular/core';
import { ProviderService } from 'src/app/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProviderAdminPageService {
  public provider$ = new BehaviorSubject(null);

  constructor() {}

  setProvider(provider: any): void {
    this.provider$.next(provider);
  }
}
