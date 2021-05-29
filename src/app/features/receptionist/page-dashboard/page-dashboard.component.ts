import { Component, OnInit } from '@angular/core';
import { ReceptionistService } from '../../../core';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {
  receptionistDetails: any = {};

  constructor(
    private receptionistService: ReceptionistService
  ) { }

  ngOnInit(): void {
    //this.receptionistDetails = this.receptionistService.localStorage_getReceptionistInfo();
   // console.log(this.receptionistDetails);

      this.receptionistService.getReceptionistInfo().subscribe(
        (res: any) => {
          this.receptionistDetails = res;
          console.log(res);
        },
        (err) => {
          console.log(err)
        }
      );
  }
}
