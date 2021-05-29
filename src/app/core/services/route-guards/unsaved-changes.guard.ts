import { Injectable } from '@angular/core';
import {  CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
 
export interface DeactivationGuarded {
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
  }
  
@Injectable()
export class UnSavedChangesGuard implements CanDeactivate<any> {
    canDeactivate(component: DeactivationGuarded):  Observable<boolean> | Promise<boolean> | boolean {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }