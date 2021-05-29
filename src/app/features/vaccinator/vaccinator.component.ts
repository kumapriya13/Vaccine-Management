import { Component, OnInit } from '@angular/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';
@Component({
  selector: 'app-vaccinator',
  templateUrl: './vaccinator.component.html',
  styleUrls: ['./vaccinator.component.scss']
})
export class VaccinatorComponent implements OnInit {

  constructor(private _toolTipService: TooltipService) { 
    this._toolTipService.toolTipUserTypeSubject.next({user_type: 'vaccinator'});
  }

  ngOnInit(): void {
  }

}
