import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { UserService } from '../../../core';

@Component({
  selector: 'app-page-edit-scan-qr',
  templateUrl: './page-edit-scan-qr.component.html',
  styleUrls: ['./page-edit-scan-qr.component.scss']
})
export class PageEditScanQrComponent implements OnInit {
  recipent: any = {};
  qrLinkDataForm: FormGroup;
  recipientId: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _router: Router,
    private notify: NotificationService,
    private route: ActivatedRoute
  ) {
    this.recipientId = this.route.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.userService.getUserById(this.recipientId).subscribe((recipient) => {
      this.recipent = recipient;
      this.getPublicRecipientProfile();
    });
    this.buildForm();
  }

  getPublicRecipientProfile() {

    let reqData = {
      "usage": "Set 'url' to either the bracelet URL or the system-generated URL for the recipient.",
      "usage2": "Endpoing only looks for the 'url' and 'includeChoices' properties; all others are ignored.",
      "url": this.recipent['recipient_url'],
      "Xurl": "http://localhost/recipient/1/0cb33afb-ae20-425a-bee5-de11e5cb0081",
      "includeChoices": false,
      recipient_id: this.recipientId
    }

    this.userService.getPublicRecipientProfile(reqData).subscribe(res => {
      let dataObject: Object = res;
      let dataArr: any[] = Object.keys(dataObject).map((key) => [key, dataObject[key]]);

      dataArr.forEach((value) => {
        value[0] = String(value[0]).replace(":", "__");
        if (this.qrLinkDataForm.get(value[0])) {
          this.qrLinkDataForm.get(value[0]).setValue(true);
        }
      });
    }, err => {
      console.log(err);
    });
  }

  buildForm() {
    this.qrLinkDataForm = this.formBuilder.group({
      fname: [true],
      lname: [true],
      dob: [false],
      mobile_number: [false],
      email: [false],
      address1: [false],
      address2: [false],
      address3: [false],
      city: [false],
      state: [false],
      zip: [false],
      country: [false],
      county: [false],
      certificates__electronic: [false],
      certificates__image: [false]
    });
  }

  qrLinkDataFormSub() {
    let public_item_names_arr = [];

    let choicesObject: Object = this.qrLinkDataForm.value;
    let choicesArr: any[] = Object.keys(choicesObject).map((key) => [key, choicesObject[key]]);

    choicesArr.forEach(value => {
      value[0] = String(value[0]).replace("__", ":");
      if (value[1]) public_item_names_arr.push(value[0]);
    });

    let reqData = {
      "public_item_names": public_item_names_arr,
      recipient_id: this.recipientId
    };

    this.userService.saveRecipientProfile(reqData).subscribe(res => {
      this.notify.showNotification("Code Details Saved", 'top', 'success');
      this.onCancel();
    }, err => {
      console.log(err);
    });
  }

  onCancel(): void {
    this._router.navigate(this.recipientId ? ['recipient/family'] : ['/recipient/profile']);
  }
}
