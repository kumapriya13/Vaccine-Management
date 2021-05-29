import { Component, OnInit } from '@angular/core';
import { AuthManageService } from '../../../core';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent {
  selectedDate: Date = new Date();
}
