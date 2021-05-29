import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  public get(path: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    _.forIn(params, (value, key) => {
      httpParams = httpParams.append(key, value);
    });
    return this.http.get(this.getRequestUrl(path));
  }

  public put(path: string, body: any = {}): Observable<any> {
    return this.http.post(this.getRequestUrl(path), body);
  }

  public post(path: string, body: any = {}): Observable<any> {
    return this.http.post(this.getRequestUrl(path), body);
  }

  public delete(path, body: any = {}): Observable<any> {
    return this.http.delete(this.getRequestUrl(path));
  }

  private getRequestUrl(url: string): string {
    return this.apiUrl + url;
  }
}
