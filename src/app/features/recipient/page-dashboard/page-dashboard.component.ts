import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../../core';
import { FamilyAppointmentComponent } from '../family-appointment/family-appointment.component';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent implements OnInit {
  userDetails: any = {};

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userService.getUserById().subscribe(
      (res: any) => {
        this.userService._userProfile.next(res);
        this.userDetails = res;
        this.userDetails = res;
        // this.userService.getclassiCode().subscribe((res:any) =>{

        //   // if(this.userDetails.classification==res.result.classification){
        //   let  objectss = res.result
        //   // }
        //   for (const property in objectss) {
        //    if(this.userDetails.classification==objectss[property].classification) {
        //    console.log(objectss[property].classification)
        //    console.log(objectss[property].is_eligible)
        //    }
        //   }
        // }

        // );
        localStorage.setItem('recipient-user', JSON.stringify(res));
      },
      (err) => {
        console.log('Something went wrong ' + err.message);
      },
    );
  }

  onFamilyAppointment(): void {
    const config = {
      height: '90%',
      width: '90%',
    };

    const dialogRef = this.dialog.open(FamilyAppointmentComponent, config);
    dialogRef
      .afterClosed()
      .pipe()
      .subscribe(() => {
      });
  }
}
