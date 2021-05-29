
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RecipientAuthService } from 'src/app/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-component-recipient-header',
  templateUrl: './component-recipient-header.component.html',
  styleUrls: ['./component-recipient-header.component.scss'],
})
export class ComponentRecipientHeaderComponent implements OnInit {
  userDetails$: any;
  constructor(
    private _router: Router,
    private userService: UserService,
    private recipientAuthService: RecipientAuthService,
  ) { }
  ngOnInit(): void {
    this.userDetails$ = this.userService._userProfile;
  }
  recipentLogIn() {
    window.open(
      'https://vms.auth.ap-south-1.amazoncognito.com/login?client_id=6nth7ffvec85nllqmdimdnd8ph&response_type=token&redirect_uri=http://localhost:4200/home',
    );
  }
  logout() {
    this.recipientAuthService.recipientSignOut();
  }
  logo = environment.logoImg;
}