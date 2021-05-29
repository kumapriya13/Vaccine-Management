import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RecipientService } from '../../../core';

@Component({
  selector: 'app-page-recipient-public-profile',
  templateUrl: './page-recipient-public-profile.component.html',
  styleUrls: ['./page-recipient-public-profile.component.scss'],
})
export class PageRecipientPublicProfileComponent implements OnInit {
  profile: any;
  imageCert: string;
  recipientUrl: string;
  electronicCertificates: any[];

  addressVisible: boolean;
  profileVisible: boolean;

  constructor(route: ActivatedRoute, private recipientService: RecipientService) {
    const { recipientUrl, profile } = route.snapshot.data.data;
    this.recipientUrl = recipientUrl;
    this.initProfile(profile);
  }

  ngOnInit(): void {}

  private initProfile(profile: any): void {
    this.profile = profile;
    this.electronicCertificates = profile['certificates:electronic'];

    this.profileVisible = !!this.profile.fname && !!this.profile.lname;
    this.addressVisible =
      this.profile.address1 ||
      this.profile.address2 ||
      this.profile.address3 ||
      this.profile.city ||
      this.profile.state ||
      this.profile.zip;

    this.recipientService.getPublicImageCertificate(this.recipientUrl).subscribe((result) => {
      this.imageCert = result.image;
    });
  }
}
