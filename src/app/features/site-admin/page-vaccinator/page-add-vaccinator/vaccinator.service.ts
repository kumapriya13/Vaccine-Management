import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InterfaceAuthRecipient } from 'src/app/shared/interfaces/interface-auth-recipient';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VaccinatorService {

  private apiUrl = environment.apiUrl;
  private ssoUrL = environment.sso_url;
  private currentRecipientSubject: BehaviorSubject<InterfaceAuthRecipient>;
  public currentRecipient: Observable<InterfaceAuthRecipient>;

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) {
    this.currentRecipientSubject = new BehaviorSubject<InterfaceAuthRecipient>(JSON.parse(localStorage.getItem('currentRecipient')));
    this.currentRecipient = this.currentRecipientSubject.asObservable();


  }



  userCheck(emailId: string): Observable<boolean> {
    const userCheckReqBody = { email: emailId }
    const url = `${this.apiUrl}user/check`;
    return this._http.post<any>(url, userCheckReqBody).pipe(
      map(x => {
        return x.Response.ExistingRecipient;
      })
    );
  }
}
