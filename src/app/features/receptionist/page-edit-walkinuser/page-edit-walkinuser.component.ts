import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { RecipientAuthService } from 'src/app/core/services/auth/recipient-auth.service';
import { ReceptionistService } from 'src/app/core/services/receptionist.service';
import { UserService } from 'src/app/core/services/user.service';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { applicableList, raceList ,GENDER_TYPES,medicalList} from '../../../shared/helpers/constant';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-page-edit-walkinuser',
  templateUrl: './page-edit-walkinuser.component.html',
  styleUrls: ['./page-edit-walkinuser.component.scss']
})
export class PageEditWalkinuserComponent {
 recepientId: any;
 redirection = '/receptionist/walk-in';
 redirectionAfterSave = '/receptionist/walk-in';
  constructor(private activatedRoute: ActivatedRoute){
    this.recepientId = this.activatedRoute.snapshot.params['id'];
    
  }
}

