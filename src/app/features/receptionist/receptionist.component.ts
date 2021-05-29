import { Component, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.scss']
})
export class ReceptionistComponent implements OnInit {

  constructor(private _toolTipService: TooltipService) { 
    this._toolTipService.toolTipUserTypeSubject.next({user_type: 'receptionist'});
  }

  ngOnInit(): void {
  }

}
