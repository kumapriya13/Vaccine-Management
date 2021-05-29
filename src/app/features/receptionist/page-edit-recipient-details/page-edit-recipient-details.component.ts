import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-page-edit-recipient-details',
  templateUrl: './page-edit-recipient-details.component.html',
  styleUrls: ['./page-edit-recipient-details.component.scss']
})
export class PageEditRecipientDetailsComponent {
//   if(this.activatedRoute.snapshot.params['typeid'] =='noCheckList')
//   this.isFromWalkinPage=true;
// }

recepientId: any;
 redirection = '/receptionist/schedule';
 redirectionAfterSave = '/receptionist/checklist';
  fromWalkinPage: any;
  constructor(private activatedRoute: ActivatedRoute){
    this.fromWalkinPage = this.activatedRoute.snapshot.params['typeid']; 
    this.recepientId = this.activatedRoute.snapshot.params['id'];
    
  }

}
