import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly apiURL = ''; /** API url required */

  constructor(private http: HttpClient) { }

  fetchGeoCoords = (stateName: string): Observable<any> => {
    return of({long: '80.840–85.605° W', latitude: '30.356–34.985° N'});
    /** API */
    // return this.http.get(`${this.apiURL}`);
  }

  saveState = (state: any): Observable<any> => {
    /** API */
    return of('');
    // return this.http.get(`${this.apiURL}`);
  }
}
