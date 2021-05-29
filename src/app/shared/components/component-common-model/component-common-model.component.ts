import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ModalDismissReasons, NgbModal,NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PageRecipientAppointmentComponent } from 'src/app/features/site-admin/page-recipient-appointment/page-recipient-appointment.component';
import { SiteAdminService } from 'src/app/core';
import { SpinnerService } from 'src/app/core/services/spinner.service';
@Component({
  selector: 'app-component-dynamic-model',
  templateUrl: `./component-common-model.component.html`,
  styleUrls: ['./component-common-model.component.scss']
})
export class ComponentCommonModelComponent {
  toolTipLocation: any =[];
  serviceSubscription: Subscription[] = [];
  toolTipData: any = [];
  toolTipUserType: any;
  loggedInUser: any;
  @ViewChild("longContent",{static: false}) longContent: ElementRef;
  data: any;
  recipient: any;
  feature:string= 'site-admin';
  hideActions: any = [];
  templateLayout: string;
  heading: string;
  constructor(
    private modalService: NgbModal,
    private _siteAdminService: SiteAdminService,
    private _spinner: SpinnerService,
    config: NgbModalConfig) {

    config.backdrop = 'static';
    config.keyboard = false;

  }
  openHelpModel(data,hideActions= []) {
    this.heading = "Appointments"
    this.templateLayout = 'appointment';
    this.hideActions = hideActions;
    this.recipient = {}
    this.data = data
    console.log("2212",data);
    this.loadRecipient();
    this._spinner.showLoader();
    this.modalService
      .open(this.longContent, { size: 'xl' }).result.then((result) => {
        console.log(`Appointments Model Closed with: ${result}`);
      }, (reason) => {
        console.log(`Appointments Dismissed ${this.getDismissReason(reason)}`);
        
      });

  }

  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngOnDestroy() {
    this.serviceSubscription.forEach(service => {
      service.unsubscribe();
    })
  }

  private loadRecipient(): void {
    this.serviceSubscription.push(this._siteAdminService.searchRecipients(`id=${this.data.recipient_id}`, 1, 1).subscribe(
      (result) => {
      this.recipient = result.results[0];
      console.log("sdsdsddsd",this.recipient);
      this._spinner.hideLoader();
      }, (err) =>{
        this._spinner.hideLoader();

   }))
  }

  openManageSchedule(){
    this.heading = "Manage Schedule"
    this.templateLayout = 'manageschedule';
    this.modalService
    .open(this.longContent, { size: 'xl' }).result.then((result) => {
      console.log(`Manage Schedule Model Closed with: ${result}`);
    }, (reason) => {
      console.log(`Manage Schedule Dismissed ${this.getDismissReason(reason)}`);
      
    });
  }

  openBookAppointment(){
    this.heading = "Book Appointment"
    this.templateLayout = 'bookappointment';
    this.modalService
    .open(this.longContent, { size: 'xl' }).result.then((result) => {
      console.log(`Book Appointment Model Closed with: ${result}`);
    }, (reason) => {
      console.log(`Book Appointment Dismissed ${this.getDismissReason(reason)}`);
      
    });
  }

  bookAppointment(){
    this.dismissModel();
    this.openBookAppointment();
  }

  dismissModel(){
    this.modalService.dismissAll();
  }

  showBookedAppointment(){
    this.dismissModel();
    //this.openHelpModel(this.data,this.hideActions);
  }

}
