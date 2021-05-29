import { Component, OnInit } from '@angular/core';
import { RecipientService } from '../../../core/services/recipient.service';
import { RecipientAuthService } from '../../../core/services/auth/recipient-auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'family-appointment',
  templateUrl: './family-appointment.component.html',
  styleUrls: ['./family-appointment.component.scss'],
})
export class FamilyAppointmentComponent implements OnInit {
  members: any[];

  currentRecipientId: any;
  profile: any;

  selectionInfo = {};
  selectedIds = [];

  recipientAvailableForAppointment: boolean;

  stepperNo: number;

  constructor(private recipientService: RecipientService, private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  reset(): void {
    this.setStepperNo(undefined);
    this.load();
  }

  disableControl(object: any): boolean {
    let numOfDoses = object.$expanded.materials[0]?.material_no_of_doses_in_series;
    //if all visits reached
    if (object?.recipient_facts !== undefined) {
      for (let ele of object?.recipient_facts) {
        if (ele.RecipientFact.dose_in_series == numOfDoses) return true;
      }
    }
    // found booked and not cancelled
    let cancelled: boolean = true;
    for (let ele of object.$expanded?.booked_visits) {
      if (ele.visit_status !== 'cancelled') {
        cancelled = false;
      }
    }
    if (object.$expanded.booked_visits?.length > 0 && cancelled == false) return true;

    // no bookings found
    if (object.$expanded.booked_visits?.length === 0) return false;
  }

  selectChanged(memberId, checked): void {
    this.selectedIds = Object.keys(this.selectionInfo).filter((id) => this.selectionInfo[id]);
  }

  bookNextAppointment(): void {
    this.setStepperNo(0);
  }

  setStepperNo(stepperNo): void {
    this.stepperNo = stepperNo;
    if (stepperNo) {
      localStorage.setItem('stepperNo', JSON.stringify(this.stepperNo));
    } else {
      localStorage.removeItem('stepperNo');
    }
  }

  private load(): void {
    this.recipientService.loadDependentUsers().subscribe(({ results }) => {
      this.members = results;
    });
    this.userService.getUserById().subscribe((result) => {
      this.profile = result;
      this.currentRecipientId = this.profile.id;

      this.userService.getRecipientVisits().subscribe(({ results }) => {
        const visits = results;
        if (visits.length === 0) {
          this.recipientAvailableForAppointment = true;
        } else {
          let numOfDoses = visits[0].$expanded.no_of_doses_in_series;

          if (visits.length < numOfDoses) {
            let completedVisit = false;
            visits.forEach((visit) => {
              if (visit.visit_status === 'completed' || visit.visit_status === 'observation') {
                completedVisit = true;
              }
            });

            this.recipientAvailableForAppointment = completedVisit;
          }
        }
      });
    });
  }
}
