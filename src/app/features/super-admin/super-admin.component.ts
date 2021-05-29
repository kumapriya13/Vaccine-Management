import { Component, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';
@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {

  constructor(private _toolTipService: TooltipService) { 
    this._toolTipService.toolTipUserTypeSubject.next({user_type: 'super_admin'});
  }

  ngOnInit(): void {
  }

}
