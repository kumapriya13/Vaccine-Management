import { Component, Inject, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { TooltipService } from 'src/app/core/services/tooltip.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
declare var $: any;
@Component({
  selector: 'app-component-dynamic-help',
  templateUrl:'./component-help.component.html',
  styleUrls: ['./component-help.component.scss']
})
export class ComponentHelpComponent {
  toolTipSubscription: Subscription;
  toolTipData: any;
  @ViewChildren("panelList") panelList: QueryList<any>;
  currentMenuItem: number =-1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.toolTipData = this.data && this.data.hasOwnProperty('toolTipData') ? this.data.toolTipData : [];
  console.log("data tooltip all=====",JSON.stringify(this.data.toolTipData))
  if(this.data && this.data.hasOwnProperty('toolTipData') && this.data.toolTipData){
    this.data.toolTipData.forEach(element => {
      console.log("data tooltip help=====:::",element.Title,element.user_type,element.Unique_location);
    });
  }
  
   
   }
  panelOpenState = false;

  helpMenuEvents(){
    
       //setTimeout(() => {
        $('.collapse.in').prev('.panel-heading').removeClass('active');
        $('#accordion')
          .on('show.bs.collapse', function(a) {
            $(a.target).prev('.panel-heading').addClass('active');
          }).on('hide.bs.collapse', function(a) {
            $(a.target).prev('.panel-heading').removeClass('active');
          });
       //}, 0);

    
  }

  ngAfterViewInit(){
    // this.panelList.toArray().forEach(data=>{
    //  console.log("list====",data.nativeElement)
    // })
  }

  showHideItems(index: number){
    //alert(index +":"+this.currentMenuItem)
    if(index !== this.currentMenuItem){
      this.currentMenuItem = index;
      this.panelList.toArray().forEach(data=>{
        data.nativeElement.childNodes[0].classList.remove('active');
        data.nativeElement.childNodes[1].classList.remove('show');
        //console.log("list====",data.nativeElement.childNodes)
       })
  }
}

}
