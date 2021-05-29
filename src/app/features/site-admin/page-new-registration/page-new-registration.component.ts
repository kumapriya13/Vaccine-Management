import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipientAuthService } from 'src/app/core/services/auth/recipient-auth.service';
//import { RecipientAuthService } from 'src/app/core';
import {
  applicableList,
  passwordContext,
  raceList, medicalList, GENDER_TYPES, GENDER_TYPES_FOR_ADD
} from 'src/app/shared/helpers/constant';
import { ModalPrivacyPolicyComponent } from 'src/app/shared/modals/modal-privacy-policy/modal-privacy-policy.component';
import { ModalTermsOfUseComponent } from 'src/app/shared/modals/modal-terms-of-use/modal-terms-of-use.component';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminRecipientInviteFormComponent } from '../../../shared/components/admin-recipient-invite-form/recipient-invite-form.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-new-registration',
  templateUrl: './page-new-registration.component.html',
  styleUrls: ['./page-new-registration.component.scss'],
  // providers: [
  //   { provide: DateAdapter, useClass: AppDateAdapter },
  //   { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  // ],
})
export class PageNewRegistrationComponent {
  isNew: boolean = true;
    recepientId: any;
     redirection = '/site-admin/appointment';
     redirectionAfterSave = '/site-admin/appointment';
      fromWalkinPage: any;
      is_allow_private = false;
      constructor(private activatedRoute: ActivatedRoute,router: Router){
       //console.log('url',router.url);
       //let urls = router.url.split("/");
        //this.recepientId = this.activatedRoute.snapshot.params['id'];
        this.isNew = true;
        //this.redirection =  this.redirectionAfterSave = (urls.length > 1 && urls[1]=='super-admin') ? 'super-admin/users/recipients' : (urls.length > 1 && urls[1]=='provider') ? 'provider/users/recipients' : '';
        
      }

}
