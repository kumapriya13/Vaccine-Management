import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-page-scan-qrcode',
  templateUrl: './page-scan-qrcode.component.html',
  styleUrls: ['./page-scan-qrcode.component.scss']
})
export class PageScanQRCodeComponent implements OnInit {

  qrImageBase64: string = '';
  showCam:boolean = false;
 

  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
   
  }
  
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  torchEnabled = true;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;


  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    console.log("QR code scanned content : "+resultString)
    this.qrResultString = resultString;

    let array = this.qrResultString.split('/');
    let recipientToken = array[array.length-1];

    console.log(" array : "+array);
    console.log(" recipientToken : "+recipientToken);


    setTimeout(function(){ 
      this.showCam=false;
    }, 1000);
     
   /* this.router.navigate(['/receptionist/appointment-card'],{
      queryParams: {
        recipientToken:recipientToken
      }
    });    
   */

  this.router.navigate(['/receptionist/recipient-appointment/'+recipientToken]);
 

  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

}
