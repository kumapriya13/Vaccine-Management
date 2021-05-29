import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { QuillEditorComponent } from 'ngx-quill';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { NotificationJobService, SiteAdminService } from '../../../../../core';

@Component({
  selector: 'app-ad-hoc-editor',
  templateUrl: './ad-hoc-editor.component.html',
  styleUrls: ['./ad-hoc-editor.component.scss'],
})
export class AdHocEditorComponent implements OnInit {
  @ViewChild(QuillEditorComponent) templateEditor: QuillEditorComponent;
  @ViewChild(NgSelectComponent) recipientSelector: NgSelectComponent;

  title: string;
  message_template: string;

  selectedRecipients: any[] = [];
  filteredRecipients: any[];
  recipientFilter$ = new Subject<string>();
  subscription: Subscription;

  schedulerOpen: boolean;

  objectId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteAdminService: SiteAdminService,
    private notificationService: NotificationJobService,
  ) {
    this.subscription = this.recipientFilter$.pipe(debounceTime(300)).subscribe((filter) => {
      this.loadFilteredRecipients(filter);
    });

    this.route.params.subscribe((params) => {
      if (params.id) {
        this.objectId = params.id;
        this.loadNotification();
      }
    });
  }

  get isNew(): boolean {
    return !this.objectId;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  recipientFieldSelected(field: string): void {
    const quillEditor = this.templateEditor.quillEditor;
    const selection = quillEditor.getSelection(true);
    quillEditor.insertText(selection.index, `{{${field}}}`);
    setTimeout(() => {
      quillEditor.focus();
    });
  }

  goToList(): void {
    this.router.navigate([this.isNew ? '../' : '../../'], { relativeTo: this.route });
  }

  onNotificationTemplateChange(content) {
    if (this.templateEditor.quillEditor.getText().trim().length) {
      this.message_template = content.html;
    } else {
      this.message_template = null;
    }
  }

  recipientListTypeChange(recipientList): void {
    if (recipientList === 'Static') {
      setTimeout(() => {
        this.loadFilteredRecipients('');
        this.recipientSelector.focus();
      });
    }
  }

  addFilteredRecipients(event): void {
    const { isSelectAll, includeRecipientIds, excludeRecipientIds, query, totalSelectedCount } = event;

    if (!totalSelectedCount) {
      return;
    }

    let filterQuery = query;

    if (isSelectAll && excludeRecipientIds.length > 0) {
      filterQuery += ' ' + excludeRecipientIds.map((recipientId) => `-id=${recipientId}`).join(' ');
    }

    if (
      this.selectedRecipients.findIndex((recipient) => recipient.isFilterQuery && recipient.query === filterQuery) > -1
    ) {
      return;
    }

    if (includeRecipientIds) {
      filterQuery = includeRecipientIds.map((recipientId) => `id=${recipientId}`).join(' OR ');

      this.siteAdminService
        .searchRecipients(filterQuery, 1, includeRecipientIds.length)
        .subscribe(({ resultMetadata, results }) => {
          results = _.differenceBy(results, this.selectedRecipients, 'id');
          this.selectedRecipients = [...results, ...this.selectedRecipients];
        });
    } else {
      this.selectedRecipients = [
        {
          isFilterQuery: true,
          query: filterQuery,
          count: totalSelectedCount,
        },
        ...this.selectedRecipients,
      ];
    }
  }

  isValid(): boolean {
    return this.title?.trim() && this.message_template && this.selectedRecipients.length > 0;
  }

  onSend(triggerTime: Date = new Date()): void {
    this.notificationService
      .createNotification(triggerTime.toISOString(), this.title, this.message_template, this.buildRecipientQuery())
      .subscribe(() => {
        this.goToList();
      });
  }

  onSchedule(): void {
    this.schedulerOpen = true;
  }

  compareRecipient(a, b): boolean {
    return a && b && a.id === b.id;
  }

  private buildRecipientQuery(): string {
    const query = this.selectedRecipients
      .map((recipient) => {
        return recipient.isFilterQuery ? `(${recipient.query})` : `id=${recipient.id}`;
      })
      .join(' OR ');

    if (query.includes('()')) {
      return '';
    }

    return query;
  }

  private loadFilteredRecipients(filter: string): void {
    if (filter) {
      filter = `recipient_wildcard=${filter}`;
    }
    this.siteAdminService.searchRecipients(filter || '', 1, 50).subscribe(({ results }) => {
      this.filteredRecipients = results;
    });
  }

  private loadNotification(): void {
    this.notificationService.getNotificationJob(this.objectId, null, null, false).subscribe((res) => {
      this.title = res.email_subject;
      this.message_template = res.email_template;
    });
  }
}
