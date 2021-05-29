import { Component, OnInit } from '@angular/core';

import { ProviderAdminPageService } from '../provider-admin-page.service';

@Component({
  selector: 'app-provider-me',
  templateUrl: './provider-me.component.html',
  styleUrls: ['./provider-me.component.scss'],
})
export class ProviderMeComponent implements OnInit {
  constructor(private providerPageService: ProviderAdminPageService) {}

  ngOnInit(): void {}

  get provider$(): any {
    return this.providerPageService.provider$;
  }
}
