import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-manage-site',
  templateUrl: './page-manage-site.component.html',
  styleUrls: ['./page-manage-site.component.scss']
})
export class PageManageSiteComponent implements OnInit {
  returnUrl: string;
  trTogglerBtnNo:any = 3;
  tableDataList = [1, 4, 6, 2];

  constructor(
    private _router: Router
  ) {
  }

  ngOnInit(): void {
  }

  trBtnToggler(value:any){
    this.trTogglerBtnNo = value;
  }
}