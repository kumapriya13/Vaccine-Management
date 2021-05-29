import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TooltipService } from 'src/app/core/services/tooltip.service';

@Component({
  selector: 'app-site-admin',
  templateUrl: './site-admin.component.html',
  styleUrls: ['./site-admin.component.scss']
})
export class SiteAdminComponent implements OnInit {

  constructor(private _toolTipService: TooltipService) { 
    this._toolTipService.toolTipUserTypeSubject.next({user_type: 'site_admin'});
  //   this.activatedRoute.data.subscribe(data => {
  //     console.log("data=====",data);
  //     this._toolTipService.toolTipUserTypeSubject.next(data);
  // })
  }

  ngOnInit(): void {
  }

}
