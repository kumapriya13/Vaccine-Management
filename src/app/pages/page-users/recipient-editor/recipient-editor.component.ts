import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import { RecipientAuthService } from 'src/app/core';
import { applicableList, GENDER_TYPES_FOR_ADD, raceList } from 'src/app/shared/helpers/constant';
import {
  APP_DATE_FORMATS,
  AppDateAdapter,
} from 'src/app/shared/helpers/dd-mm-yyyy-formater';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { ComponentUserStaticQuestionnaireComponent } from 'src/app/shared/components/component-user-static-questionnaire/component-user-static-questionnaire.component';
import { COUNTIES } from 'src/app/shared/helpers/constant';
import { BulkUpload } from 'src/app/core/services/bulkupload.service';
import { adminRouteByType } from '../constants';
import { AdminAuthService } from '../../../core/services/auth/admin-auth.service';
import * as moment from 'moment';
import { AdminService } from '../../../core/services/admin.service';
import { ModalPrivacyPolicyComponent } from 'src/app/shared/modals/modal-privacy-policy/modal-privacy-policy.component';
import { ModalTermsOfUseComponent } from 'src/app/shared/modals/modal-terms-of-use/modal-terms-of-use.component';
import { SiteAdminService } from '../../../core/services/site-admin.service';
import { Location } from '@angular/common';
import { AdminRecipientInviteFormComponent } from 'src/app/shared/components/admin-recipient-invite-form/recipient-invite-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@UntilDestroy()
@Component({
  selector: 'app-recipient-editor',
  templateUrl: './recipient-editor.component.html',
  styleUrls: ['./recipient-editor.component.scss'],
})
export class RecipientEditorComponent  {
  isNew: boolean = true;
    recepientId: any;
     redirection = '../../recipients';
     redirectionAfterSave = '../../../recipients';
      fromWalkinPage: any;
      is_allow_private = false;
      constructor(private activatedRoute: ActivatedRoute,router: Router){
       console.log('url',router.url);
       let urls = router.url.split("/");
        this.recepientId = this.activatedRoute.snapshot.params['id'];
        this.isNew = !this.recepientId;
        this.redirection =  this.redirectionAfterSave = (urls.length > 1 && urls[1]=='super-admin') ? 'super-admin/users/recipients' : (urls.length > 1 && urls[1]=='provider') ? 'provider/users/recipients' : '';
        
      }

  
}
