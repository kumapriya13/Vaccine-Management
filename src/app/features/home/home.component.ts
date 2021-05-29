import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <app-component-header></app-component-header>
  <router-outlet></router-outlet>`,
})
export class HomeComponent {
  constructor() { }
}
