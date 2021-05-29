import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NotificationJobService, SiteAdminService } from 'src/app/core';
@Component({
  selector: 'recipient-list-input',
  templateUrl: './recipient-list-input.component.html',
})
export class RecipientListInputComponent implements OnInit {
  @Input() onlyFirstAppointment: boolean;
  @Input() selectedVaccine: any = null;
  @Output() isFilterClick = new EventEmitter<boolean>();
  selectedRecipients: any[] = [];
  filteredRecipients: any[];
  recipientFilter$ = new Subject<string>();
  subscription: Subscription;

  constructor(private siteAdminService: SiteAdminService, private notificationService: NotificationJobService) {
    this.subscription = this.recipientFilter$.pipe(debounceTime(300)).subscribe((filter) => {
      this.loadFilteredRecipients(filter);
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addFilteredRecipients(event): void {
     console.log('event',event)
    this.isFilterClick.emit(event.isFilteredSubmitted)
    const { isSelectAll, includeRecipientIds, excludeRecipientIds, query, totalSelectedCount } = event;
    this.selectedRecipients = [];
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
          this.selectedRecipients = [
            ...results
            , ...this.selectedRecipients
          ];
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

  buildRecipientQuery(): string {
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

  compareRecipient(a, b): boolean {
    let today = new Date();
    // var birthDate = new Date(this.dobdate);
    // if()
    // var age = today.getFullYear() - birthDate.getFullYear();
    // if (age < 18) {
    //       return this.notify.showNotification(
    //         'Age should be greater than or equal to 18',
    //         'top',
    //         'error'
    //       );

    // }

    return a && b && a.id === b.id;
  }

  private loadFilteredRecipients(filter: string): void {
    if (filter) {
      filter = `recipient_wildcard=${filter}`;
    }
    this.siteAdminService.searchRecipients(filter || '', 1, 50, undefined, true).subscribe(({ results }) => {
      this.filteredRecipients = results;
    });
  }
}
