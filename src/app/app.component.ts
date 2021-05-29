import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DocumentInterruptSource, Idle, StorageInterruptSource } from '@ng-idle/core';

import { AuthManageService, IDLE_TIMEOUT } from './core';
import { TooltipService } from './core/services/tooltip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'us-vms';

  constructor(router: Router, private idleWatcher: Idle, private authManageService: AuthManageService, private _toolTipService:TooltipService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.gotoTop();
      }
    });

    this.monitorIdleStatus();
  }

  ngOnInit():void {
    console.log("App init method to load tooltip");
    this._toolTipService.getToolTipText().subscribe(
      (resp)=>{
        console.log('Tooltip api called');
        localStorage.setItem('toolTipData',JSON.stringify(resp));
      },
      (err)=>{
         console.log('Error in tooltip api calling '+err);
      }
    )
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  private monitorIdleStatus(): void {
    this.idleWatcher.setIdle(IDLE_TIMEOUT);
    this.idleWatcher.setTimeout(false);
    this.idleWatcher.setInterrupts([ new DocumentInterruptSource("mousedown"), new StorageInterruptSource() ]);

    this.idleWatcher.onIdleStart.pipe().subscribe(() => {
      this.authManageService.logout();
    });

    this.idleWatcher.watch();
  }
}
