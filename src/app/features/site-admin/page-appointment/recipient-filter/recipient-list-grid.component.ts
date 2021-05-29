import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SiteAdminService } from 'src/app/core';


@Component({
  selector: 'recipient-list-grid',
  templateUrl: './recipient-list-grid.component.html',
})
export class RecipientListGridComponent implements OnInit {
  @Input() filter: string = '';
  @Input() onlyFirstAppointment: boolean;
  @Output() addFilteredRecipients = new EventEmitter();

  @Input('selectedVaccine') _selectedVaccine: any = null;
  @Input() set selectedVaccine(value: any) {
    this._selectedVaccine = value;
    this.setCheckedBassedOnVaccine(value);
  }

  recipientsOnPage: any[];

  pageSize: number = 5;
  pageIndex: number = 1;
  totalCount: number;

  recipientSelectInfo: { [key: string]: boolean } = {};
  unselectedRecipientInfo: { [key: string]: boolean } = {};

  isSelectAll: boolean;
  selectAllCheckboxValue: boolean;

  constructor(private siteAdminService: SiteAdminService) { }

  ngOnInit(): void {
    this.selectAll();
    this.loadRecipients();
  }

  get selectedRecipients(): any {
    return Object.values(this.recipientSelectInfo);
  }

  loadRecipients(): void {
    this.siteAdminService
      .searchRecipients(this.filter, this.pageIndex, this.pageSize, undefined, this.onlyFirstAppointment)
      .subscribe(({ resultMetadata, results }) => {
        this.totalCount = resultMetadata.count;
        this.recipientsOnPage = results;

        if (this.isSelectAll) {
          this.selectAll();
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

  checkDisable(recipient: any) {
    let condition = false;
    let year = moment().diff(moment(recipient.dob), 'year');
    // Janseen or Mordorna
    if (this._selectedVaccine == '28756daa-e635-4609-bf06-e14c7a6f2a6b' || this._selectedVaccine == '08756daa-e635-4609-bf06-e14c7a6f2a6b') {
      condition = year >= 18 ? true : false;
    }
    // phiffer
    else if (this._selectedVaccine == '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
      condition = year >= 12 ? true : false;
    } else if (this._selectedVaccine == null) {
      condition = true;
    }

    return !condition;
  }

  selectChanged(recipient: any, checked: boolean): void {
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

    this.recipientsOnPage?.forEach((recipient) => { this.recipientSelectInfo[recipient.id] = true });
    this.setCheckedBassedOnVaccine(this._selectedVaccine);
    this.setSelectAllCheckboxStatus();
  }

  setCheckedBassedOnVaccine(vaccine: any) {

    this.recipientsOnPage?.forEach((recipient) => {
      let condition = false;

      let year = moment().diff(moment(recipient.dob), 'year');
      // Janseen or Mordorna
      if (vaccine == '28756daa-e635-4609-bf06-e14c7a6f2a6b' || vaccine == '08756daa-e635-4609-bf06-e14c7a6f2a6b') {
        condition = year >= 18 ? true : false;
      }
      // phiffer
      else if (vaccine == '18756daa-e635-4609-bf06-e14c7a6f2a6b') {
        condition = year >= 12 ? true : false;
      } else if (vaccine == null) {
        condition = true;
      }

      if (condition && (this.isSelectAll || this.recipientSelectInfo[recipient.id])) {
        this.recipientSelectInfo[recipient.id] = true;
      } else {
        this.recipientSelectInfo[recipient.id] = false;
      }
    });
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
      isFilteredSubmitted: true
    });
  }

  private setSelectAllCheckboxStatus(): void {
    this.selectAllCheckboxValue =
      this.isSelectAll && Object.values(this.recipientSelectInfo).filter((selected) => !selected).length === 0;
  }
}
