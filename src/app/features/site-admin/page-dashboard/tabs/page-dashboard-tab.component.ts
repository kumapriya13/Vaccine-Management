import { Component } from "@angular/core";
import { ActivatedRoute, Router,Event as NavigationEvent,NavigationStart } from "@angular/router";
 import { filter } from 'rxjs/operators'

@Component({
    selector: "site-admin-page-dashboard-tab",
    templateUrl: "./page-dashboard-tab.component.html",
    styleUrls: ['../page-dashboard.component.scss']
})

export class PageDashboardTabComponent {
    selectedTab: any = '';
    event$: any;
    constructor(private _router: Router, private _activatedRoute: ActivatedRoute){
        //alert(this._router.url)
        this.event$ =this._router.events
            .subscribe(
              (event: NavigationEvent) => {
                if(event instanceof NavigationStart) {
                    try{
                        let url = event.url.split('/');
                        this.selectedTab = url[url.length -1];
                    } catch(e){
                        let url = this._router.url.split('/');
                        this.selectedTab = url[url.length -1];
                    }

                }
              });
    }

    ngOnInit(){
        if(this.selectedTab==""){
            let url = this._router.url.split('/');
                        this.selectedTab = url[url.length -1];
                        console.log("=======",this.selectedTab);
        }
    }


    ngOnDestroy() {
      this.event$.unsubscribe();
    }

    currentTab(value: string){
        this.selectedTab = value ;
    }

    }

