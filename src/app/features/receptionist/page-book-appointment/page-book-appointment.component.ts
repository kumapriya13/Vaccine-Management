import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-page-book-appointment',
  templateUrl: './page-book-appointment.component.html',
  styleUrls: ['./page-book-appointment.component.scss'],
})
export class PageBookAppointmentComponent {
  recipient_id: any;
  recipient_id_by_input: any;
  redirectAfterSave = '/receptionist/walk-in'
  @Output() showBookedAppointment = new EventEmitter();
  @Input() modelContent: boolean = false;
  @Input('recipient') 
  set recipient(value: string) {
    this.recipient_id = value;
    console.log("booking data input",value);
  }

  constructor(private activatedRoute: ActivatedRoute) {
    this.recipient_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("booking data route",this.recipient_id);
  }

  showAppointment(){
    this.showBookedAppointment.emit();
  }
 

  

}
