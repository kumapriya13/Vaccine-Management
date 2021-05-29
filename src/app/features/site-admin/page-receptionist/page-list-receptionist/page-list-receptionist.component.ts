import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-list-receptionist',
  templateUrl: './page-list-receptionist.component.html',
  styleUrls: ['./page-list-receptionist.component.scss']
})
export class PageListReceptionistComponent implements OnInit {
  dataSource: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.getStaticDataReceptionist();
  }

  getStaticDataReceptionist(){

    this.dataSource = [
      {Seat: '1',  Vaccinator : "John doe",Phone:"+1 123456789"},
      {Seat: '2',  Vaccinator : "John doe", Phone:"+1 123456789"},
      {Seat: '3',  Vaccinator : "John doe",Phone:"+1 123456789"},
      {Seat: '4',  Vaccinator : "John doe",Phone:"+1 123456789"},
      ]

  }
}
