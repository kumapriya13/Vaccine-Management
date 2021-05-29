import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipient-register-next',
  templateUrl: './recipient-register-next.component.html',
  styleUrls: ['./recipient-register-next.component.scss']
})
export class RecipientRegisterNextComponent implements OnInit {

  constructor(private _router: Router,) { }

  ngOnInit(): void {
  }
  savedata(){
    this._router.navigate(['/super-admin/users/recipients']);

  }
}
