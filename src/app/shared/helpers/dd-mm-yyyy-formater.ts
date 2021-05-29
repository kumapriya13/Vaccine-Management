import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {

    if (displayFormat === `input`) {
      let day: string = date.getDate().toString();

      /**
       * Checking day according to that making  before day if day less than 10 else accepted as it is
       */

      day = +day < 10 ? `0` + day : day;

      let month: string = (date.getMonth() + 1).toString();

      /**
       * Checking month according to that making 0 before month if day less than 10 else accepted as it is
       */

      month = +month < 10 ? `0` + month : month;

      let year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }

    return date.toDateString();
  }
}

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: `short`, year: `numeric`, day: `numeric` },
  },

  display: {
    dateInput: `input`,
    monthYearLabel: { year: `numeric`, month: `numeric` },
    dateA11yLabel: {
      year: `numeric`,
      month: `long`,
      day: `numeric`,
    },
    monthYearA11yLabel: { year: `numeric`, month: `long` },
  },
};
