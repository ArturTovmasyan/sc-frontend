import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Discount} from '../models/discount';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class DiscountService extends GridService<Discount> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/discount`;
  }
}