import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Location } from '@angular/common';
import { ComponentHelpComponent } from '../component-help/component-help.component';
import { ActivatedRoute } from '@angular/router';
import { TooltipService } from 'src/app/core/services/tooltip.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { isArray } from 'lodash';
import { AuthManageService } from '../../../core';
@Component({
  selector: 'app-component-dynamic-heading',
  templateUrl: `./component-heading.component.html`,
  styleUrls: ['./component-heading.component.scss']
})
export class ComponentHeadingComponent {
  @Input() heading;
  @Input() refererClick = false;
  @Input() listIcon = false;
  @Input() background = 'background: transparent linear-gradient(270deg, #71b7fe 0%, #0984e3 100%) 0% 0% no-repeat padding-box;';
  @Input() textClass = 'roboto-medium-30 white-text m-0 px-2';
  @Input() dashboardHeader = false;
  @Input() userTypeLabel = '';
  @Input() caseType = ''

  toolTipLocation: any = [];
  toolTipSubscription: Subscription[] = [];
  toolTipData: any = [];
  toolTipUserType: any;
  loggedInUser: any;
  siteObject: any = {};

  constructor(
    private _location: Location,
    public dialog: MatDialog,
    private activatedroute: ActivatedRoute,
    private _toolTipService: TooltipService,
    private _spinner: SpinnerService,
    private authManageService: AuthManageService) {

    this.toolTipSubscription.push(this._toolTipService.toolTipUserTypeSubject$.subscribe(parent => {
      console.log("data tooltip  parent subject=====1", parent);
      this.toolTipUserType = parent && parent.hasOwnProperty('user_type') ? parent.user_type : '';
    }))

    this.toolTipSubscription.push(this.activatedroute.data.subscribe(data => {
      console.log("data tooltip child=====1", data);
      this.toolTipLocation = data && data.hasOwnProperty('location') ? data.location : '';
    }))
  }
  openHelpModel() {
    const dialogRef = this.dialog.open(ComponentHelpComponent, {
      data: {
        toolTipData: this.toolTipData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
    this.loggedInUser = this.authManageService.getLoggedInUser();
    this.siteObject = this.loggedInUser['sites'] ? this.loggedInUser['sites'][0]:'';
    //todo:-ajay:- below code is not required, after testing this must be removed
    // if(!localStorage.getItem('selectedSiteId'))
    //     this.siteObject = this.loggedInUser['sites'][0];
    // else{
    //       let site_id = localStorage.getItem('selectedSiteId'); 
    //       let sites = this.loggedInUser['sites'];
    //       let elements =  sites.filter(x => x.site_id === site_id);    
    //       this.siteObject =  elements[0]; 
    // }
    // console.log('obj.... '+JSON.stringify(this.siteObject));
    //console.log('------'+this.siteObject['site_name']);
    this.toolTipSubscription.push(this._toolTipService.getToolTips().subscribe((data) => {
      if (data && data.hasOwnProperty('data') && data.data) {
        let toolTipData = data.data;
        //this.toolTipLocation &&
        if (this.toolTipLocation && this.toolTipUserType && toolTipData) {
          if (isArray(this.toolTipLocation)) {
            this.toolTipLocation.forEach(element => {
              console.log("element====", element)
              let dd = toolTipData.filter(d => {
                return (d.Unique_location.indexOf(element) > - 1 && d.user_type.indexOf(this.toolTipUserType) > -1);
              });
              this.toolTipData.push(...dd);
            });
          } else {
            this.toolTipData = toolTipData.filter(d => {
              return (d.Unique_location.indexOf(this.toolTipLocation) > - 1 && d.user_type.indexOf(this.toolTipUserType) > -1);
            })
          }
        }
        console.log("tooltip====", this.toolTipData, this.toolTipLocation, this.toolTipUserType);
      } else {
        this.toolTipData = "";
      }

    },
      (error) => {
        this.toolTipData = "";
      })
    )
  }

  ngOnDestroy() {
    this.toolTipSubscription.forEach(element => {
      element.unsubscribe()
    });
  }

}
