import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SiteAdminService } from '../../../../../core';

@Component({
  selector: 'recipient-list-grid',
  templateUrl: './recipient-list-grid.component.html',
})
export class RecipientListGridComponent implements OnInit {
  @Input() filter: string = '';
  @Output() addFilteredRecipients = new EventEmitter();

  recipientsOnPage: any[];

  pageSize: number = 10;
  pageIndex: number = 1;
  totalCount: number;

  recipientSelectInfo: { [key: string]: boolean } = {};
  unselectedRecipientInfo: { [key: string]: boolean } = {};

  isSelectAll: boolean;
  selectAllCheckboxValue: boolean;

  constructor(private siteAdminService: SiteAdminService) {}

  ngOnInit(): void {
    this.selectAll();
    this.loadRecipients();
  }

  get selectedRecipients(): any {
    return Object.values(this.recipientSelectInfo);
  }

  loadRecipients(): void {
    this.siteAdminService
      .searchRecipients(this.filter, this.pageIndex, this.pageSize)
      .subscribe(({ resultMetadata, results }) => {
        this.totalCount = resultMetadata.count;
        this.recipientsOnPage = results;

        if (this.isSelectAll) {
          this.recipientsOnPage.forEach((recipient) => {
            if (typeof this.recipientSelectInfo[recipient.id] === 'undefined') {
              this.recipientSelectInfo[recipient.id] = true;
            }
          });
        }
      });
  }

  onPageChange(pageIndex): void {
    this.pageIndex = pageIndex;
    this.loadRecipients();
  }

  selectAllChange(checked: boolean): void {
    checked ? this.selectAll() : this.unselectAll();
  }

  selectChanged(recipientId, checked: boolean): void {
    this.setSelectAllCheckboxStatus();
  }

  applyFilter(filter: any): void {
    this.filter = filter;
    this.pageIndex = 1;
    this.selectAll();
    this.loadRecipients();
  }

  selectAll(): void {
    this.isSelectAll = true;
    Object.keys(this.recipientSelectInfo).forEach((recipientId) => {
      this.recipientSelectInfo[recipientId] = true;
    });
    this.recipientSelectInfo = {};
    this.recipientsOnPage?.forEach((recipient) => (this.recipientSelectInfo[recipient.id] = true));
    this.setSelectAllCheckboxStatus();
  }

  unselectAll(): void {
    this.isSelectAll = false;
    this.recipientSelectInfo = {};
    this.setSelectAllCheckboxStatus();
  }

  onAddFilteredRecipients(): void {
    const includeRecipientIds = Object.keys(this.recipientSelectInfo).filter(
      (recipientId) => this.recipientSelectInfo[recipientId],
    );
    const excludeRecipientIds = Object.keys(this.recipientSelectInfo).filter(
      (recipientId) => !this.recipientSelectInfo[recipientId],
    );

    this.addFilteredRecipients.emit({
      query: this.filter,
      totalSelectedCount: this.isSelectAll ? this.totalCount - excludeRecipientIds.length : includeRecipientIds.length,
      isSelectAll: this.isSelectAll,
      includeRecipientIds: this.isSelectAll ? null : includeRecipientIds,
      excludeRecipientIds: this.isSelectAll ? excludeRecipientIds : null,
    });
  }

  private setSelectAllCheckboxStatus(): void {
    this.selectAllCheckboxValue =
      this.isSelectAll && Object.values(this.recipientSelectInfo).filter((selected) => !selected).length === 0;
  }
}
