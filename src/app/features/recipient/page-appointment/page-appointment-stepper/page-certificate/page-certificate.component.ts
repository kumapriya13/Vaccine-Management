import { Component, Input, OnInit } from '@angular/core';
import { result } from 'lodash';

import { UserService } from '../../../../../core';

@Component({
  selector: 'app-page-certificate',
  templateUrl: './page-certificate.component.html',
  styleUrls: ['./page-certificate.component.scss'],
})
export class PageCertificateComponent implements OnInit {
  userInfo: any;
  qrImageBase64: string = '';

  @Input('recipientVisit') _recipientVisit: any = {};
  @Input() set recipientVisit(value: any[]) {
    this._recipientVisit = this.userService.getRecipientVisitsTolocalStorageInAscendingByCreatedTime();
    if (this._recipientVisit['results']) {
      this.bindMaterialBatch(this._recipientVisit['results']);
    }
  }
  get recipientVisit(): any[] {
    let reverseArr=this._recipientVisit['results'].reverse();
    return reverseArr;
  }

  constructor(private userService: UserService) {
    this.userInfo = JSON.parse(localStorage.getItem('recipient-user'));
  }
  ngOnInit(): void {
    this.recipientQRCode();
  }

  recipientQRCode() {
    let reqData = {
      $comment:
        'Find the render options here: https://www.npmjs.com/package/qrcode#renderers-options',
      options: {},
    };
    this.userService.recipientQRCode(reqData).subscribe(
      (res) => {
        this.qrImageBase64 = res.code;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  bindMaterialBatch(recipientVisit: any[] = []) {
    recipientVisit.forEach((element, index) => {
      if (element['batch_material_id']) {
        this.userService.getMaterialBatch(element.batch_material_id).subscribe(
          (res) => {
            recipientVisit[index]['batch_material_name'] = res['batch_no'];
          },
          (err) => {
            recipientVisit[index]['batch_material_name'] = "";
          }
        )
      }
    });
  }
}
