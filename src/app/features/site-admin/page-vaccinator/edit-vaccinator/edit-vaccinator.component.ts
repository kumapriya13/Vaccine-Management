import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { SiteAdminService } from '../../../../core';

@Component({
  selector: 'app-edit-vaccinator',
  templateUrl: './edit-vaccinator.component.html',
  styleUrls: ['./edit-vaccinator.component.scss'],
})
export class EditVaccinatorComponent implements OnInit {
  vaccinator: any;
  id: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private siteAdminService: SiteAdminService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getVaccinator(this.id);
  }

  getVaccinator(id: string) {
    this.siteAdminService.getVaccinatorById(id).subscribe(
      (res) => {
        this.vaccinator = res;
        console.log(this.vaccinator);
      },
      (err) =>
        this.notify.showNotification('Something went wrong', 'bottom', 'error')
    );
  }
}
