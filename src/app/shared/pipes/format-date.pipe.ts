import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, format: string = 'MM-DD-yyyy'): any {
    return moment(value).format(format);
  }
}
