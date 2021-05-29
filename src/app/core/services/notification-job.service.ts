import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationJobService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  public createNotification(
    trigger_time: string,
    message_title: string,
    message_template: string,
    receiving_user_query: string,
  ): Observable<any> {
    const url = `${this.apiUrl}notificationJobs/recipient/save`;

    const body = {
      trigger_time,
      email_subject: message_title,
      email_template: message_template,
      receiving_user_query,
      send_email: true,
      send_sms: false,
    };

    return this._http.post<any>(url, body);
  }

  public getNotificationJob(
    id: string,
    page: number = 1,
    pageLength: number = 10,
    includeTargets = true,
  ): Observable<any> {
    const url = `${this.apiUrl}notificationJobs/recipient/get`;

    const body = {
      id,
      includeTargets,
      page,
      pageLength,
    };

    return this._http.post<any>(url, body);
  }

  public getNotificationList(status: 'pending' | 'processing' | 'sent'): Observable<any> {
    const url = `${this.apiUrl}notificationJobs/recipient/search`;

    const body = { status };

    return this._http.post<any>(url, body);
  }

  public deleteNotificationJob(id: string): Observable<void> {
    const url = `${this.apiUrl}notificationJobs/recipient/delete`;

    const body = { id };

    return this._http.post<any>(url, body);
  }
}
