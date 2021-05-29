import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  public recepientIDSubject = new Subject();
  recepientIDSubjectObservable = this.recepientIDSubject.asObservable();
  constructor(private spinner: NgxSpinnerService) {}

  showLoader() {
    this.spinner.show('customspinner', {
      type: 'ball-clip-rotate',
      size: 'medium',
    });
  }

  hideLoader() {
    this.spinner.hide('customspinner');
  }
}
