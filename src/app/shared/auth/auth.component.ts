import { Component, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private _toolTipService: TooltipService) {
    let tokens = ['site_admin', 'super_admin', 'facility_admin', 'receptionist', 'provider_admin', 'vaccinator', 'dailysite'];

    try {
      let currentAuthLoggedKey = localStorage.getItem('current-auth-logged-key').split("-");
      //let admin = JSON.parse(localStorage.getItem(currentAuthLoggedKey));
      console.log("data", currentAuthLoggedKey);
      let ind = tokens.filter(d => currentAuthLoggedKey[0].includes(d));
      console.log("data ind",ind)
      if (ind.length > 0) {
        //alert(ind[0])
        this._toolTipService.toolTipUserTypeSubject.next({user_type: ind[0]});
      }
    } catch (err) {
      //alert('error')
      this._toolTipService.toolTipUserTypeSubject.next({user_type: ""});
    }


  }


  ngOnInit(): void {
  }

}
