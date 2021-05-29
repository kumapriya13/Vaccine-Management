import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class SuperAdminService {
    private super_admin: any;
    private apiUrl = environment.apiUrl;
    private ssoUrL = environment.sso_url;

    constructor(private _http: HttpClient) {}

    getSite(reqObj: any): Observable<any> {
      const url = `${this.apiUrl}manage/search/site`;
      return this._http.post<any>(url, reqObj);
    }

    getSitesData(reqData:any){
      const url = `${this.apiUrl}site/get`;
      return this._http.post<any>(url, reqData);
    }

      saveSite(reqObj: any): Observable<any> {
        const url = `${this.apiUrl}site/save`;

        reqObj.total_no_of_seats = 0;
        return this._http.post<any>(url, reqObj);
      }

    editsaveSite(reqObj: any,ids:string): Observable<any> {
      const url = `${this.apiUrl}site/patch?id=${ids}`;
      return this._http.post<any>(url, reqObj);
    }

    deleteSite(id: string){
      const siteReq = { id: id };

      const url = `${this.apiUrl}site/delete`;
      return this._http.post<any>(url, siteReq);
    }

    saveQuestionnaire(reqObj: any): Observable<any> {
      const url = `${this.apiUrl}QuestionnaireDynamic/save`;
      return this._http.post<any>(url, reqObj);
    }

    searchQuestionnaire(reqObj: any): Observable<any> {
      const url = `${this.apiUrl}QuestionnaireDynamic/search`;
      return this._http.post<any>(url, reqObj);
    }

    getQuestionnaire(reqObj: any): Observable<any> {
      const url = `${this.apiUrl}QuestionnaireDynamic/get`;
      return this._http.post<any>(url, reqObj);
    }

    deleteQuestionnaire(reqObj: any): Observable<any> {
      const url = `${this.apiUrl}QuestionnaireDynamic/delete`;
      return this._http.post<any>(url, reqObj);
    }
  }
