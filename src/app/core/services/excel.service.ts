import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], filename: string): void {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(json);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      xlsx.writeFile(workbook, filename);
    });
  }
}
