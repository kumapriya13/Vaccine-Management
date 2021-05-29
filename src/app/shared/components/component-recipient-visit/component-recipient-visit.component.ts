import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NgbModal,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { AdminService, UserService } from '../../../core';
import { SiteService } from '../../../core/services/site.service';

@Component({
  selector: 'component-recipient-visit',
  templateUrl: './component-recipient-visit.component.html',
  styleUrls: ['./component-recipient-visit.component.scss'],
})
export class ComponntRecipientVisitComponent implements OnInit {
  serviceSubscription: Subscription[] = [];
  @Output() bookAppointmentModel = new EventEmitter();
  @Output() bookAppointment = new EventEmitter();
  @Output() adverseEventReport = new EventEmitter();

  // @Input() recipientId: string = '';
  @Input() feature : string = '';
  @Input() hideActions: any = [];
  recepientData: any
  isCancelClicked: boolean;
  @Input('recipient') 
  set recipient(value: string) {
    this.recepientData = value;
    if(this.recepientData && this.recepientData.hasOwnProperty('id')){
      this.loadVisits()
      this.recipientQRCode();
    console.log("adcd",this.recepientData,this.hideActions);
    }
    
  }


  isEligible: boolean = true;
  hasVisits: boolean;
  visits: any[];
  qrImageBase64: string;
  responseRecived:boolean = false;

  constructor(private adminService: AdminService, private userService: UserService, private siteService: SiteService,private modalService: NgbModal, private _spinner: SpinnerService) {}
  
  ngOnInit(): void {
    //this.loadVisits();
  }

  bookNextAppointment(): void {
    if(this.hideActions.length > 0){
     // this.modalServiceClose.close();
     this.bookAppointmentModel.emit();
    } else {
      this.bookAppointment.emit();
    }
    
  }

  cancleAppointment(recipientVisitItem,event): void {
    //event.target.disabled = true
    this.isCancelClicked = true;
    if(this.isCancelClicked){
      setTimeout(() => {
        this.isCancelClicked = false;
      }, 5000);
    }
    //console.log("event",event); return;
    let reqData = {
      visit_id: recipientVisitItem.id,
      recipient_id: this.recepientData.id,
    };

    this.serviceSubscription.push(this.adminService.cancelRecipientVisit(reqData).subscribe(
      (res: any) => {
        console.log(res);
        this.loadVisits();
        if(this.hideActions.length > 0){
          this._spinner.recepientIDSubject.next({status: 'load_seats'})
        }
      },
      (err) => {
        console.log(err);
      },
    ));
  }

  adverseEvent(visitId: string): void {
    this.adverseEventReport.emit(visitId);
  }

  private loadVisits(): void {
    this.serviceSubscription.push(this.adminService.getRecipientVisits(this.recepientData.id).subscribe((visits) => {
      this.visits = visits;
      this.hasVisits = !!this.visits.length;
      this.responseRecived=true;
      localStorage.setItem('recipientInQRScan',JSON.stringify(this.visits[0]));
    }));
  }

  private recipientQRCode() {
    let reqData = {
      $comment: 'Find the render options here: https://www.npmjs.com/package/qrcode#renderers-options',
      options: {},
    };
    this.serviceSubscription.push(this.userService.recipientQRCode({ recipient_id: this.recepientData.id }).subscribe(
      (res) => {
        this.qrImageBase64 = res.code;
      },
      (err) => {
        console.log(err);
      },
    ));
  }
  ngOnDestroy() {
    this.serviceSubscription.forEach(service => {
      console.log("service",service)
      service.unsubscribe();
    })
  }


  checkState(data,action){
     //console.log("dddd",data,action)
    if(data && data.length > 0 ) {
      let res = data.filter(d => d.action==action && d.status==true);
      if (res.length > 0) {
        return true
      } else {
        return false;
      }
    } else {
      return true;
    }

  }
  
}
