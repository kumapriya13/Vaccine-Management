import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss'],
})
export class BookAppointmentComponent {
  recipient_id: any;
  recipient_id_by_input: any;
  redirectAfterSave = '/site-admin/appointment'
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
