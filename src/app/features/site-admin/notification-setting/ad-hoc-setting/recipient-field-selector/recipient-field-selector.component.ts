import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipient-field-selector',
  templateUrl: './recipient-field-selector.component.html',
  styleUrls: ['./recipient-field-selector.component.scss'],
})
export class RecipientFieldSelectorComponent implements OnInit {
  @Output() selected = new EventEmitter<string>();

  @Input() name: string = 'Field';

  fields: string[];

  constructor() {
    this.fields = ['firstName', 'lastName', 'address', 'visitInfo', 'dose1', 'dose2', 'classificationCode', 'qrCode'];
  }

  ngOnInit(): void {}

  onFieldClick(field: string): void {
    this.selected.emit(field);
  }
}
