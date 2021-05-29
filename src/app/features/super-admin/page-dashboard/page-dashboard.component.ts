import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthManageService } from 'src/app/core';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {


  loggedInUser: any;

   constructor(
    private authManageService: AuthManageService,
  ) {
  }

  get loggedInUser$(): BehaviorSubject<any> {
    return this.authManageService.loggedInUser$;
  }

  ngOnInit(): void {   
  }

}
