import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISearchResult } from '../../domain';
import { ApiService } from '../http/api.service';

@Injectable({
  providedIn: 'root',
})
export class ObjectBaseService {
  constructor(protected apiService: ApiService, private url?: string) {}

  search(q: string = '', page: number = 1, pageLength = 10): Observable<ISearchResult> {
    return this.apiService.post(this.buildUrl('search'), {
      q,
      page,
      pageLength
    });
  }

  get(id: string): Observable<any> {
    return this.apiService.post(this.buildUrl('get'), {
      id,
    });
  }

  save(object: string): Observable<any> {
    return this.apiService.post(this.buildUrl('save'), object);
  }

  delete(id: string): Observable<any> {
    return this.apiService.post(this.buildUrl('delete'), {
      id,
    });
  }

  private buildUrl(path: string): string {
    return this.url ? `${this.url}/${path}` : this.url;
  }
}
