import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { RecipientService } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.scss'],
})
export class FamilyListComponent implements OnInit {
  members: any[];
  selectInfo: { [key: string]: boolean } = {};

  bulkAddEditorOpen: boolean;

  constructor(private recipientService: RecipientService, private modalService: NgbModal, private router: Router) {
    this.load();
  }

  ngOnInit(): void {}

  select(id: string): void {
    // this.selectInfo[id] = !this.selectInfo[id];
    this.router.navigate(['recipient', 'profile', 'dependent', id]);
  }

  onDelete(content: any, object: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.recipientService.deleteDependentUser(object.id).subscribe(() => {
        _.remove(this.members, { id: object.id });
      });
    });
  }

  openBulkAddEditor(): void {
    this.bulkAddEditorOpen = true;
  }

  bulkSaveMembers(members: any[]): void {
    this.recipientService.registerDependentUser(members).subscribe(() => {
      this.load();
    });
  }

  private load(): void {
    this.recipientService.loadDependentUsers().subscribe(({ results }) => {
      this.members = results;
    });
  }
}
