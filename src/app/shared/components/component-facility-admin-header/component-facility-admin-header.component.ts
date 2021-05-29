import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-component-facility-admin-header',
  templateUrl: './component-facility-admin-header.component.html',
  styleUrls: ['./component-facility-admin-header.component.scss']
})
export class ComponentFacilityAdminHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
logo = environment.logoImg;
}
