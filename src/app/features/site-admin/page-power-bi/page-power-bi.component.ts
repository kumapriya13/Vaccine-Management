import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as pbi from 'powerbi-client';
import { environment } from 'src/environments/environment';
// import { PowerbiReportService } from '../../../../core/services/powerbi-report.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-page-power-bi',
  templateUrl: './page-power-bi.component.html',
  styleUrls: ['./page-power-bi.component.scss']
})
export class PagePowerBiComponent implements OnInit {

  report: pbi.Embed;
  @ViewChild('reportContainer', { static: true }) reportContainer: ElementRef;
  url: string = environment.biKey;
  urlSafe: SafeResourceUrl;
  constructor(
    // private powerbiReportService: PowerbiReportService,
    private spinnerService: SpinnerService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
