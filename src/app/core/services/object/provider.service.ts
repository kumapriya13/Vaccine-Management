import { Injectable } from '@angular/core';

import { ApiService } from '../http';
import { ObjectBaseService } from './object-base.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService extends ObjectBaseService {
  constructor(apiService: ApiService) {
    super(apiService, 'provider');
  }
}
