import { Component, OnInit } from '@angular/core';
  

import {
GENDER_TYPES
} from '../../../../shared/helpers/constant';

@Component({
  selector: 'app-page-add-receptionist',
  templateUrl: './page-add-receptionist.component.html',
  styleUrls: ['./page-add-receptionist.component.scss']
})
export class PageAddReceptionistComponent implements OnInit {
  genderData  = GENDER_TYPES;

  constructor() { }

  ngOnInit(): void {
  }

}
