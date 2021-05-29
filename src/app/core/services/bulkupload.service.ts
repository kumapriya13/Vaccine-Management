import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

  @Injectable({
    providedIn: 'root'
  })

  export class BulkUpload {
    token = 'super_admin-token';
    private apiUrl = environment.apiUrl;
    constructor(private _http: HttpClient, private _router: Router, private _cookieService: CookieService) {}
    CheckUserName(data) {
      let url = this.apiUrl + 'admin/checkUserAvailable';

      return this._http.post < any > (url, {
        user: data
      });
    }

    saveAdmin(object: any, adminType: string): Observable<any> {
      let url;
      if (object.id) {
        url = 'manage/user/save';
      } else {
        switch (adminType) {
          case 'state-admin':
            url = "admin/invite/state_admin";
            break;
          case 'county-admin':
            url = "admin/invite/county_admin";
            break;
          case 'receptionist':
            url = "admin/invite/receptionist";
            break;
          case 'site-admin':
            url = "admin/invite/site_admin";
            break;
          case 'provider-admin':
            url = "admin/invite/provider_admin";
            break;
          case 'vaccinator':
            url = "admin/invite/vaccinator";
            break;
          default:
            url = `admin/invite/${adminType}`;
            break;
        }
      }

      url = this.apiUrl + url;

      return this._http.post < any > (url, object);
    }

    providerAdminSave(reqData) {
      let url = reqData.id ? this.apiUrl + "manage/user/save" : this.apiUrl + "admin/invite/provider_admin";

      return this._http.post < any > (url, reqData);
    }
    siteAdminSave(reqData) {
      let url = reqData.id ? this.apiUrl + "manage/user/save" : this.apiUrl + "admin/invite/site_admin";

      return this._http.post < any > (url, reqData);
    }

    getProviderSelect() {
      let url = this.apiUrl + "provider/search";

      return this._http.post < any > (url, {
        q: "",
        page: 1,
        pageLength: 500
      });
    }
    getSiteSelect(criteria?: any) {
      let url = this.apiUrl + "manage/search/site";

      return this._http.post < any > (url, {
        q: "",
        criteria
      });
    }

    providerSave(reqData) {
      let url = this.apiUrl + "provider/save";

      return this._http.post < any > (url, reqData);
    }
    getUserDetailById(data) {
      let url = this.apiUrl + "manage/user/details";

      return this._http.post < any > (url, {
        id: data
      });
    }
    getProviderDataUser(data) {
      let reqRecipient = {
        q: data.searchdata ? data.searchdata : "",
        page: data.pageIndex,
        pageLength: data.pageLength,
        sort: ""
      };
      let url = this.apiUrl + "provider/search";

      return this._http.post < any > (url, reqRecipient);
    }
    deleteProviderDataUser(id: String) {
      let dataObj = {
        id: id
      }
      let url = this.apiUrl + "provider/delete";

      return this._http.post < any > (url, dataObj);
    }
    getProviderUserId(data) {
      let url = this.apiUrl + "provider/get";

      const superadminInfo = JSON.parse(localStorage.getItem(this.token));
      return this._http.post < any > (url, {
        id: data
      });
    }
    getVaccineDataUser(data) {
      let reqRecipient = {
        q: data.searchdata ? data.searchdata : "",
        page: data.pageIndex,
        pageLength: data.pageLength,
        sort: ""
      };
      let url = this.apiUrl + "material/search";

      return this._http.post < any > (url, reqRecipient);
    }
    vaccineSave(reqData) {
      let url = this.apiUrl + "material/save";

      return this._http.post < any > (url, reqData);
    }


    getVaccineUserId(data) {
      let url = this.apiUrl + "material/get";

      return this._http.post < any > (url, {
        id: data
      });
    }
    deleteVaccineDataUser(id: string) {
      let dataObj = {
        id: id
      }
      let url = this.apiUrl + "material/delete";

      return this._http.post < any > (url, dataObj);

    }

    getAdminDataUser(data) {
      let reqRecipient = {
        q: data.searchdata ? 'user_wildcard='+data.searchdata:"",
        //q: data.searchdata ? 'user_wildcard='+data.searchdata+' AND user_type=site_admin':"",
        //q: data.searchdata ? data.searchdata : "",
        page: data.pageIndex,
        pageLength: data.pageLength,
        sort: ""
      };
      let url = this.apiUrl + "manage/user/search";

      return this._http.post < any > (url, reqRecipient);
    }
    getUserStatus(data){
      let reqRecipient = {
        user_id : data.id
      }
  
      let url = !data.is_disabled ? this.apiUrl + "manage/user/disable" : this.apiUrl + "manage/user/enable";
      return this._http.post < any > (url, reqRecipient);
    }
    getRecipientDataUser(data): Observable<any> {
      let reqRecipient = {
       // q: data.searchdata ? 'user_wildcard='+data.searchdata+' AND user_type=recipient':"", 
       q: data.searchdata ? data.searchdata:"",      
        page: data.pageIndex,
        pageLength: data.pageLength,
        sort: ""
      };
      let url = this.apiUrl + "manage/recipient/search";

      return this._http.post < any > (url, reqRecipient);
    }

    getData(fileToUpload: File) {
      let url = `${this.apiUrl}load/recipients/`;
      let formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      return this._http.post < any > (url, formData).pipe(map(pipeRes => {
        return pipeRes;
      }));
    }

    recipientsTemplate() {
      let url = `${this.apiUrl}load/recipients/sample`;
      return this._http.post < any > (url, {});
    }

    RecipientEdit(reqData: any) {
      let url = this.apiUrl + "manage/recipient/save";

      return this._http.post < any > (url, reqData);
    }

    RecipientSave(reqData: any) {
      let url = this.apiUrl + "manage/recipient/create";

      return this._http.post < any > (url, reqData);
    }

    deleteRecipientDataUser(data: string) {
      let dataObj = {
        user: data
      }
      let url = this.apiUrl + "admin/deleteRecipientUser";

      return this._http.post < any > (url, dataObj);
    }
  }
