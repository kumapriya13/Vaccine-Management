import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthManageService {
  public static AUTH_KEY = 'auth';
  public static LOGGED_IN_USER_KEY = 'loggedinUser';

  loggedInUser$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private router: Router) {
    const user = this.getLoggedInUser();
    this.loggedInUser$.next(user);
  }

  public get loggedInUser(): any {
    return this.loggedInUser$.value;
  }

  public isLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }

  public getLoggedInUser(): any {
    if (this.loggedInUser) {
      return this.loggedInUser;
    } else {
      return this.loadStorageValue(AuthManageService.LOGGED_IN_USER_KEY);
    }
  }

  public setLoggedInUser(user: any): any {
    this.loggedInUser$.next(user);
    localStorage.setItem(AuthManageService.LOGGED_IN_USER_KEY, JSON.stringify(user));
  }

  public loadAuth(): any {
    return this.loadStorageValue(AuthManageService.AUTH_KEY);
  }

  public saveAuth(user: any): void {
    this.setLoggedInUser(user);

    const { access_token, jwt, refresh_token, email_verified, phone_number_verified } = user;
    this.saveToken(access_token, jwt, refresh_token);
  }

  public saveToken(access_token, jwt, refresh_token): void {
    localStorage.setItem(
      AuthManageService.AUTH_KEY,
      JSON.stringify({
        access_token,
        jwt,
        refresh_token,
      }),
    );
  }

  public clearAuth(): void {
    localStorage.clear();
    this.loggedInUser$.next(null);
    // localStorage.removeItem(AuthManageService.AUTH_KEY);
    // localStorage.removeItem(AuthManageService.LOGGED_IN_USER_KEY);
  }

  public setEmailVerified(): void {
    this.loggedInUser.email_verified = true;
    this.setLoggedInUser(this.loggedInUser);
  }

  public setMobileNumberVerified(): void {
    this.loggedInUser.phone_number_verified = true;
    this.setLoggedInUser(this.loggedInUser);
  }

  public isRecipientUser(): boolean {
    return !!this.getLoggedInUser()?.recipient_id;
  }

  public isAdminUser(): boolean {
    return !!this.getLoggedInUser()?.user_type;
  }

  public logout(redirectToHome: boolean = true): void {
    let redirectUrl;
    if (redirectToHome) {
      redirectUrl = 'home';
    } else {
      if (this.isRecipientUser()) {
        redirectUrl = 'auth/sign-in';
      } else {
        redirectUrl = 'auth/vaccinator-sign-in';
      }
    }

    this.router.navigateByUrl(redirectUrl);

    // Please don't touch this, we need to clear localStorage on logout, or will cause security issue!!
    // Change password issue is not related to this clearAuth - Avoid hacking for just one issue
    this.clearAuth();
  }

  private loadStorageValue(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  }
}
