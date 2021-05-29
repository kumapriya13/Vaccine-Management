import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { TooltipService } from 'src/app/core/services/tooltip.service';

@Directive({
  selector: '[vmsTooltip]'
})
export class VmsTooltipDirective {

  @Input('vmsTooltip') toolTipkey: string;
  @Input() placement: string;
  @Input() delay: string;
  tooltip: HTMLElement;
  delayTime: any = 10;
  //toolTipData:any;
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2, private _toolTipService: TooltipService) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.tooltip) { this.hide(); }
    if (!this.tooltip) { this.show(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) { this.hide(); }
  }

  @HostListener('click') onClick() {
    if (this.tooltip) { this.hide(); }
  }

  ngOnInit(){
    /*this._toolTipService.getToolTips().subscribe(data =>{
      this.toolTipData = data;    
    })*/
    
    if(!this._toolTipService.toolTipData){
        console.log('ngOnInit of VmsTooltipDirective ')
        this._toolTipService.toolTipData = JSON.parse(localStorage.getItem("toolTipData"));
     }   
  }

  getToolTip(key: string){
    let data = this._toolTipService.toolTipData.data.filter((d:any) => d.Keyword == key)
    if(data){
        return data[0]?.Value;
    }
  }

  show() {
    let toolTipText=this.getToolTip(this.toolTipkey);  
    if(!toolTipText)
        return;

    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }, this.delayTime);
  }

  create() {
        let toolTipText=this.getToolTip(this.toolTipkey);  
        
        this.tooltip = this.renderer.createElement('span');
        this.renderer.appendChild(
          this.tooltip,
          this.renderer.createText(toolTipText));

        this.renderer.appendChild(document.body, this.tooltip);
        this.renderer.addClass(this.tooltip, 'ng-tooltip');
        this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

        this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
      
  }

  setPosition() {

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;
    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
