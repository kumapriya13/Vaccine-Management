import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import {
  RecipientService,
  SiteService,
  UserService,
} from '../../../../../core';

import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-page-vaccine-site-container',
  templateUrl: './page-vaccine-site-container.component.html',
  styleUrls: ['./page-vaccine-site-container.component.scss'],
})
export class PageVaccineSiteContainerComponent
  implements OnInit, AfterViewInit {
  material: any;
  selectedVaccine: boolean = true;
  distanceMiles: number = 100;
  stepperFromLocalStorage: number = 2; // do not change this key value
  @Input('materialList') materialList: any = [];
  @Output('changeZip')
  changeZip: EventEmitter<number> = new EventEmitter<number>();

  @Output('changeDistanceMiles')
  changeDistanceMiles: EventEmitter<number> = new EventEmitter<number>();

  @Output('searchTrigger')
  searchTrigger: EventEmitter<number> = new EventEmitter<number>();

  @Output('changeSite') changeSite: EventEmitter<any> = new EventEmitter<any>();
  @Output('changeMaterial')
  changeMaterial: EventEmitter<any> = new EventEmitter<any>();
  @Input('myStepper') myStepper: MatStepper = null;

  @Input('siteList') _siteList: any[] = [];
  get siteList(): any[] {
    return this._siteList;
  }
  @Input() set siteList(value: any[]) {
    this._siteList = value;
    this.updateMarkers(this._siteList);
  }

  @Input('selectedIndexFromEvent') _selectedIndexFromEvent: number = 0;
  get selectedIndexFromEvent(): number {
    return this._selectedIndexFromEvent;
  }
  @Input() set selectedIndexFromEvent(value: number) {
    this._selectedIndexFromEvent = value;
    if (this._selectedIndexFromEvent == 0) {
      this.updateMarkers(this._siteList);
    }
  }

  @Input('recipientVisit') _recipientVisit: any = {};
  @Input() set recipientVisit(value: any[]) {
    this._recipientVisit = this.userService.getRecipientVisitsTolocalStorageInAscendingByCreatedTime();
    if (this._recipientVisit['results'].length > 0) {
      console.log('xssx',this._recipientVisit['results'][0])
      let obj = {
        id: this._recipientVisit['results'][0].$expanded.material_id,
        name: this._recipientVisit['results'][0].$expanded.vaccine,
      };
      this.changeMaterialHandler(obj);
      this.selectedVaccine = false;
    } else this.selectedVaccine = true;
  }
  get recipientVisit(): any[] {
    return this._recipientVisit;
  }

  constructor(
    private userService: UserService,
    private recipientService: RecipientService,
    private _siteService: SiteService,
    private _NotificationService:NotificationService
  ) {}

  ngAfterViewInit(): void {}

  zipValue: number;

  ngOnInit(): void {
    let zip = JSON.parse(localStorage.getItem('recipient-user')).zip;
   
    this.zipValue = zip;
    this.searchTriggerHandler();
  }

  changeMaterialHandler(material) {
   //this.materialss=
    this.material = material;
    console.log(this.material);
    let dobs = JSON.parse(localStorage.getItem('recipient-user')).dob
    // console.log('recepient',JSON.parse(localStorage.getItem('recipient-user')));
     console.log(dobs);
    if(material.name=='Moderna' || material.name=='Janssen'){
      let today = new Date();  
      var birthDate = new Date(dobs);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (m < 0) {
      m += 12;
    }
      if (age < 18) {
        return this._NotificationService.showNotification(
          'Age should be greater than or equal to 18',
          'top',
          'error'
        );
      }
      else{
        this.changeMaterial.emit(material);
      }
    }
    if(material.name=='Pfizer'){
        this.changeMaterial.emit(material);
    }

    //
  }

  zipHandler() {
    this.changeZip.emit(this.zipValue);
  }

  distanceMilesHandler() {
    this.changeDistanceMiles.emit(this.distanceMiles);
  }

  searchTriggerHandler() {
    this.zipHandler();
    this.distanceMilesHandler();
    this.searchTrigger.emit();
  }

  siteHandler(site: any) {
    this.changeSite.emit(site);
  }

  zoom = 10;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    // mapTypeId: 'hybrid',
    scrollwheel: false,
    streetViewControl: false,
    scaleControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
  };

  markers: any[] = [];

  updateMarkers(dataList: any[]) {
    this.zoom = 8;
    this.stepperFromLocalStorage = parseFloat(
      JSON.parse(localStorage.getItem('stepperNo'))
    );

    setTimeout(() => (this.zoom = 10), 1000);
    if (
      (this.myStepper === null && this.stepperFromLocalStorage === 0) ||
      (this.myStepper && this.myStepper.selectedIndex === 0)
    ) {
      this.markers = [];
      if (dataList.length > 0) {
        this.center = {
          lat: parseFloat(dataList[0]['latitude']) || 0,
          lng: parseFloat(dataList[0]['longitude']) || 0,
        };

        this.center = {
          lat: this.center.lat,
          lng: this.center.lng - 0.3,
        };

        dataList.forEach((value) => {
          let lat;
          let lng;

          try {
            lat = parseFloat(value.latitude);
            lng = parseFloat(value.longitude);
          } catch (error) {
            lat = 0;
            lng = 0;
          }

          this.markers.push({
            position: { lat, lng },
            label: { color: 'red', text: '1' },
            title: '1',
            info: '1',
            options: { animation: 1 },
          });
        });
        console.log(this.markers);
      } else {
        this._siteService
          .getPlaceGeoLoc(String(this.zipValue))
          .subscribe((res) => {
            if (res) {
              this.center = {
                lat: res.geometry.location.lat || 0,
                lng: res.geometry.location.lng || 0,
              };

              let marker = JSON.parse(JSON.stringify(this.center));

              this.center = {
                lat: this.center.lat,
                lng: this.center.lng - 0.3,
              };

              this.markers.push({
                position: marker,
                label: { color: 'blue', text: '.' },
                title: '.',
                info: res.formatted_address,
                options: {
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'blue',
                    strokeColor: 'blue',
                    fillOpacity: 0.1,
                    strokeOpacity: 0.1,
                    scale: 100,
                  },
                },
              });
            }
          });
      }
    }
  }
}
