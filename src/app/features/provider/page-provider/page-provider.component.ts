import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TooltipService } from 'src/app/core/services/tooltip.service';

@UntilDestroy()
@Component({
  selector: 'app-page-provider',
  templateUrl: './page-provider.component.html',
  styleUrls: ['./page-provider.component.scss'],
})
export class PageProviderComponent implements OnInit {
  constructor(private _toolTipService: TooltipService) { 
    this._toolTipService.toolTipUserTypeSubject.next({user_type: 'provider_admin'});
  //   this.activatedRoute.data.subscribe(data => {
  //     console.log("data=====",data);
  //     this._toolTipService.toolTipUserTypeSubject.next(data);
  // })
  }
  ngOnInit(): void {}
}
