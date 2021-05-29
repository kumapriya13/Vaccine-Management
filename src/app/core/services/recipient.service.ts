import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ISearchResult } from '../domain';
import { AuthManageService } from './auth';
import { ApiService } from './http/api.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class RecipientService {
  public vaccinationDate: Date;

  private apiUrl = environment.apiUrl;
  constructor(
    private _http: HttpClient,
    private authManageService: AuthManageService,
    private apiService: ApiService,
  ) {}

  sitesearchbyZipId(zipId: number): Observable<any> {
    const url = `${this.apiUrl}site/searchbyZipId`;
    const reqBody: object = { zip: zipId };
    return this._http.post<any>(url, reqBody).pipe(
      map((x) => {
        return x.Response;
      }),
    );
  }

  getMaterialList(): Observable<any> {
    const url = `${this.apiUrl}material/list`;
    return this._http.get<any>(url).pipe(
      map((x) => {
        return x.Response;
      }),
    );
  }

  materialListNames(): Observable<any> {
    const url = `${this.apiUrl}material/listNames`;

    return this._http.post<any>(url, {});
  }

  updateUserProfile(formData: any): Observable<any> {
    const updateUserProfileReq = {
      lname: formData['lastName'],
      fname: formData['firstName'],
      dob: moment(formData['dob']).format('YYYY-MM-DD'),
      gender: formData['gender'],
      email: formData['email'],
      mobile_number: formData['phone'],
      latitude: 25.6615,
      longitude: -80.441,
      geopoint: '25.6615,-80.441',
      address1: formData['address'],
      address2: '',
      address3: '',
      city: 'Miami',
      state: 'FL',
      zip: formData['zip'],
      county: '',
      country: 'United States',
      health_worker_category: 'doctor',
      is_vaccinator: true,
      is_eligible: true,
      eligibility_status: '3',
      eligiblity_reason: '',
      comorbidities: [],
      questionnaire_answers: [],
      recipient_facts: [
        {
          RecipientFact: {
            first_dose_allocated_flag: 0,
            second_dose_allocated_flag: 0,
            third_dose_allocated_flag: 0,
            first_dose_date: '',
            second_dose_date: '',
            third_dose_date: '',
            first_status: 'Not Done',
            second_status: 'Not Done',
            third_status: 'Not Done',
            first_dose_not_done_reason: '',
            second_dose_not_done_reason: '',
            third_dose_not_done_reason: '',
            registered_date: '2020-05-18',
            first_appointment_id: '',
            second_appointment_id: '',
            third_appointment_id: '',
            is_deleted: false,
          },
        },
      ],
    };
    const url = `${this.apiUrl}recipient/profile/save`;
    return this._http.post<any>(url, updateUserProfileReq, { withCredentials: true });
  }

  // linkBraceletSearchQrCode(QRCodeId: number): Observable<any> {
  //   const url = `${this.apiUrl}recipient/QRCode`;
  //   const reqBody: object = { qrCode: QRCodeId };
  //   return this._http.post<any>(url, reqBody).pipe(
  //     map(x => {
  //       return x.Response;
  //     })
  //   );
  // }

  getQrCode() {
    let url = `${this.apiUrl}recipient/QRCode`;

    return this._http.post<any>(url, {});
  }
  isBraceletLinkWithReceipient() {
    let url = `${this.apiUrl}recipient/profile`;

    return this._http.post<any>(url, {});
  }

  public getPublicViewProfile(recipientUrl: string): Observable<any> {
    const url = `${this.apiUrl}recipient/profile/public`;

    return this._http.post(url, {
      url: recipientUrl,
      includeChoices: false,
    });
  }

  public getPublicImageCertificate(recipientUrl: string): Observable<{ image: string }> {
    const url = `${this.apiUrl}recipient/profile/public/image/certificate`;

    return this._http.post<any>(url, {
      url: recipientUrl,
    });
  }

  public uploadProfileImage(imageFile, ImageFileName, recipient_id?: string) {
    let url = `${this.apiUrl}recipient/profile/image/upload`;

    return this._http.post<any>(url, { imageFile: imageFile, imageFilename: ImageFileName, recipient_id });
  }
  //getCertificatePreview

  public getProfileImage(recipient_id?: string) {
    let url = `${this.apiUrl}recipient/profile/image`;

    return this._http.post<any>(url, { recipient_id });
  }

  removeProfileImage(recipient_id?: string){
    let url = `${this.apiUrl}recipient/profile/imageDelete`;

    return this._http.post<any>(url, { recipient_id });
  }

  public uploadCertificate(imageFile, ImageFileName, recipient_id?: string) {
    let url = `${this.apiUrl}recipient/profile/certificate/upload`;

    return this._http.post<any>(url, { imageFile: imageFile, imageFilename: ImageFileName, recipient_id });
  }

  public getCertificatePreview(recipient_id?: string) {
    let url = `${this.apiUrl}recipient/profile/public/image/certificate/preview`;

    let reqObj = {
      recipient_id,
      usage: "Pass in the same 'public_item_name' array as given to /recipient/profile/public/preview.",
      usage2:
        "When you have this returning a certificate (encoded in base64), consider temporarily removing 'certificates:images' from the list to prove preview uses it",
      public_item_names: [
        'address1',
        'address2',
        'address3',
        'certificates:electronic',
        'certificates:image',
        'city',
        'country',
        'county',
        'dob',
        'email',
        'ethnicity',
        'fname',
        'gender',
        'lname',
        'mobile_number',
        'races',
        'state',
        'zip',
        'shouldBeIgnored',
      ],
    };

    return this._http.post<any>(url, reqObj);
  }

  public sendEmailVerificationCode(): Observable<any> {
    const { access_token } = this.authManageService.loadAuth();

    return this.apiService.post('login/recipient/emailVerification/challenge', {
      accessToken: access_token,
    });
  }

  public sendSmsVerificationCode(): Observable<any> {
    const { access_token } = this.authManageService.loadAuth();

    return this.apiService.post('login/recipient/phoneVerification/challenge', {
      accessToken: access_token,
    });
  }

  public verifyEmailCode(code): Observable<any> {
    const { access_token } = this.authManageService.loadAuth();

    return this.apiService.post('login/recipient/emailVerification/verify', {
      accessToken: access_token,
      code,
    });
  }

  public verifySmsCode(code): Observable<any> {
    const { access_token } = this.authManageService.loadAuth();

    return this.apiService.post('login/recipient/phoneVerification/verify', {
      accessToken: access_token,
      code,
    });
  }

  public registerDependentUser(objects: any[]): Observable<any> {
    return this.apiService.post('recipient/dependent/register', objects);
  }

  public loadDependentUsers(): Observable<ISearchResult> {
    return this.apiService.post('recipient/dependent/list');
  }

  public deleteDependentUser(id: string): Observable<any> {
    return this.apiService.post('recipient/dependent/delete', { id });
  }
}
