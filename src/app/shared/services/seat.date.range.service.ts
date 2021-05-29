import { Injectable } from '@angular/core';

import { SeatDates } from '../interfaces/seat-dates';

@Injectable({
  providedIn: 'root'
})

export class SeatDateRangeService {

  private _dates: SeatDates;
  
  setDates(dates: SeatDates) {
    this._dates = dates;
  }

  getDates() {
    return this._dates;
  }

}