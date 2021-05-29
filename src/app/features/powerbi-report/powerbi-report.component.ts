import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as pbi from 'powerbi-client';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.scss']
})
export class PowerbiReportComponent implements OnInit {
  report: pbi.Embed;
  @ViewChild('reportContainer', { static: false }) reportContainer: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  showReport(Token) {
    // Embed URL    
    // let embedUrl = environment.powerBI.reportBaseURL;
    // let embedReportId = environment.powerBI.reportID; let settings: pbi.IEmbedSettings = {
    //   filterPaneEnabled: false,
    //   navContentPaneEnabled: false,
    // }; 
    //   {
    //     "authorityUrl" : "https://login.microsoftonline.com/common/",
    //     "resourceUrl" : "https://analysis.windows.net/powerbi/api",
    //     "apiUrl" : "https://api.powerbi.com/",
    //     "appId" : "83a2b760-e929-4907-8f2e-da306b897b8f”,
    //     "workspaceId" : "87cb103b-a404-402f-bd56-628bf2a068d2”,
    //     "reportId" : “3ff5be14-67ad-49d4-bc3e-ebed8f142140”,
    //     "username" : "BITrigyn_VMS",
    //     "password" : “Account@123$”
    // }

    //   let config: pbi.IEmbedConfiguration = {
    //     type: 'report',
    //     tokenType: pbi.models.TokenType.Embed,
    //     accessToken: Token.token,
    //     embedUrl: embedUrl,
    //     id: embedReportId,
    //     filters: [],
    //     settings: settings
    //   }; 

    //   let reportContainer = this.reportContainer.nativeElement;
    //   let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    //   this.report = powerbi.embed(reportContainer, config);
    //   this.report.off("loaded"); this.report.on("loaded", () => {
    //     console.log("Loaded");
    //   }); this.report.on("error", () => {
    //     console.log("Error");
    //   });
    // }


  }

}