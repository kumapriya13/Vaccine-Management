import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { constrcutCustomeError } from 'src/app/shared/helpers/utility-functions';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-page-location-add-state',
  templateUrl: './page-location-add-state.component.html',
  styleUrls: ['./page-location-add-state.component.scss'],
})
export class PageLocationAddStateComponent implements OnInit, OnDestroy {
  private awake$ = new Subject<void>();

  stateForm: FormGroup = this.fb.group({
    stateName: ['', [Validators.required]],
    latitude: [{value: '', disabled: true}, [Validators.required]],
    longitude: [{value: '', disabled: true}, [Validators.required]],
  });

  get controls(): any {
    return this.stateForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private service: StateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  stateOnSubmit(): void {
    console.log(this.stateForm.value);
    /** API call to save the info */
    this.service
      .saveState(this.stateForm.value)
      .pipe(takeUntil(this.awake$))
      .subscribe(
        (res) => {
          this.notificationService.showNotification(
            'Saved successfully',
            'top',
            'success'
          );
        },
        (err) => {
          if (err.error.text === '') {
            this.notificationService.showNotification(
              'Something went wrong',
              'top',
              'error'
            );
          }
          /** Fixed the code
           *  Calling custom errro message to get appropirate message
           */
          this.notificationService.showNotification(
            constrcutCustomeError(err),
            'top',
            'error'
          );
        }
      );
  }

  subscriptions = () => {
    this.stateForm.controls.stateName.valueChanges
      .pipe(
        takeUntil(this.awake$),
        filter((value) => value !== null && value.length > 3)
      )
      .subscribe((value) => {
        /** API call to get log & latidue */
        this.service
          .fetchGeoCoords(value)
          .pipe(takeUntil(this.awake$))
          .subscribe((coords) => {
            this.stateForm.patchValue({
              latitude: parseFloat(coords.latitude) || 0,
              longitude: parseFloat(coords.longitude) || 0,
            });
          });
      });
  };

  ngOnDestroy(): void {
    this.awake$.next();
    this.awake$.complete();
  }
}
