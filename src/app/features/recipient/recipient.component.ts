import { Component, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.scss']
})
export class RecipientComponent implements OnInit {

  constructor(private _toolTipService: TooltipService) { 
    this._toolTipService.toolTipUserTypeSubject.next({user_type: 'recipient'});
  }

  ngOnInit(): void {
  }

}
