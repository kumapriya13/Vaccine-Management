import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-component-header',
  templateUrl: './component-header.component.html',
  styleUrls: ['./component-header.component.scss']
})
export class ComponentHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  recipentLogIn() {
    window.open('https://vms.auth.ap-south-1.amazoncognito.com/login?client_id=6nth7ffvec85nllqmdimdnd8ph&response_type=token&redirect_uri=http://localhost:4200/home');
  }
 logo = environment.logoImg;

}
