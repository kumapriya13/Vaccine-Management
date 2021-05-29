import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserToken } from 'src/app/core/models/user-toke';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SiteService } from '../../../core';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
})
export class PageHomeComponent implements OnInit {
  myTabSelectedIndex: number = 0;
  getZip: number;
  siteList: any[];
  distanceMiles: number = 100;
  myCurrentLocation = []
  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private _siteService: SiteService,
    private _NotificationService: NotificationService
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.myCurrentLocation = [{
        position: { lat: this.center.lat, lng:this.center.lng },
        // label: { color: 'red', text: '1' },
        title: '1',
        options: { animation: 1, color: 'green',
        icon: '../../../../assets/images/blue-dot.png'
      },
      }]
      this.markers.push(this.myCurrentLocation[0]);
    })



    if (this.route.url.includes('id_token')) {
      const urls = this.route.url.replace('#', '&').split('&');
      const userToken: UserToken = {
        id_token: urls[1].split('=')[1],
        access_token: urls[2].split('=')[1],
        expires_in: urls[3].split('=')[1],
        token_type: urls[4].split('=')[1],
      };

      localStorage.setItem('user-token', JSON.stringify(userToken));

      if (userToken) this.route.navigate(['/recipient/dashboard']);
    }
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
    setTimeout(() => (this.zoom = 10), 1000);
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
        this.markers.push({
          position: { lat: parseFloat(value.latitude), lng:parseFloat(value.longitude) },
          label: { color: 'red', text: '1' },
          title: '1',
          info: '1',
          options: { animation: 1, color: 'blue' },
        });
      });
      if(this.myCurrentLocation.length){
        this.markers = [...this.myCurrentLocation,...this.markers ]
      }
    } else {
      this._siteService.getPlaceGeoLoc(String(this.getZip)).subscribe((res) => {
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
          if(this.myCurrentLocation.length){
            this.markers = [...this.myCurrentLocation,...this.markers ]
          }
        }
      });
    }
  }

  getSiteListBySearch() {
    let reqObj = {
      zipCode: this.getZip,
      availableVisitsOnly: false,
      distanceMiles: Number(this.distanceMiles),
      // distanceMiles: 75,
      vaccineList: [],
    };
    this._siteService.getSiteBySearch(reqObj).subscribe(
      (res: any) => {
        this.updateMarkers(res.results);
        this.siteList = res.results;
        if (this.siteList['length'] == 0)
          return this._NotificationService.showNotification(
            'No Site Found',
            'top',
            'error'
          );
      },
      (err) => {
        this.siteList = [];
        // this.updateMarkers([]);
        return this._NotificationService.showNotification(
          'Enter valid zip code',
          'top',
          'error'
        );
        console.log(err);
      }
    );
  }
}
