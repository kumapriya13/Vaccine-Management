import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-edit-recepient',
  templateUrl: './page-edit-recepient.component.html',
  styleUrls: ['./page-edit-recepient.component.scss'],
})
export class PageEditRecepientComponent {
 
recepientId: any;
 redirection = '/site-admin/appointment';
 redirectionAfterSave = '/site-admin/appointment';
  fromWalkinPage: any;
  is_allow_private = true;
  constructor(private activatedRoute: ActivatedRoute){

    this.recepientId = this.activatedRoute.snapshot.params['id'];
    
  }
}
