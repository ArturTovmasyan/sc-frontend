import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentCreditDiscountItem} from '../models/resident-credit-discount-item';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ResidentCreditDiscountItemService extends GridService<ResidentCreditDiscountItem> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident-credit-discount-item`;
  }
}
