import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  toolTips = [];
  private apiUrl = environment.apiUrl;

  public toolTipData:any;

  toolTipUserTypeSubject = new BehaviorSubject<any>("");
  toolTipUserTypeSubject$ = this.toolTipUserTypeSubject.asObservable();

  constructor(private _http: HttpClient) { }

   public getToolTipText():Observable<any> {
       //let reqBody ={ key: keyStr }
       let url = this.apiUrl + 'toolTips/details'; //tooltip api url
       return this._http.post<string>(url, {});
   }



  getToolTips(): Observable<any> {
    return this._http.get("assets/tooltip.json");
  }

}