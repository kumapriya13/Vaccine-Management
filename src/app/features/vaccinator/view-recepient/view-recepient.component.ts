import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipientAuthService } from 'src/app/core/services/auth/recipient-auth.service';
import { ReceptionistService } from 'src/app/core/services/receptionist.service';
import { UserService } from 'src/app/core/services/user.service';
import { CountriesService } from 'src/app/shared/services/countries.service';

//import { RecipientAuthService, ReceptionistService, UserService } from '../../../core';
import { applicableList, raceList } from '../../../shared/helpers/constant';
@Component({
  selector: 'app-view-recepient',
  templateUrl: './view-recepient.component.html',
  styleUrls: ['./view-recepient.component.scss'],
})
export class ViewRecepientComponent {
 
  recepientId: any;
  redirection = '/vaccinator/schedule';
  redirectionAfterSave = '/vaccinator/schedule';
  fromWalkinPage: any;
  disable_form: boolean = true;
  //is_allow_private = true;
  remove_submit = true;
  constructor(private activatedRoute: ActivatedRoute){
    this.recepientId = this.activatedRoute.snapshot.params['id'];
    
  }
}