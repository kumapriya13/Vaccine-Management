import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService, ReceptionistService } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-component-receptionist-header',
  templateUrl: './component-receptionist-header.component.html',
  styleUrls: ['./component-receptionist-header.component.scss']
})

export class ComponentReceptionistHeaderComponent implements OnInit {

  receptionistDetails$: any;

  constructor(
    private _router: Router,
    private adminAuthService: AdminAuthService,
    private vs: ReceptionistService,
  ) { }

  ngOnInit(): void {
    this.receptionistDetails$ = this.vs._userProfile;
  }

  logout() {
    this.adminAuthService.adminSignOut();
  }
  logo = environment.logoImg;
}
