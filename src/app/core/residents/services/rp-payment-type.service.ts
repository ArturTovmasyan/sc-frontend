import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {RpPaymentType} from '../models/rp-payment-type';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class RpPaymentTypeService extends GridService<RpPaymentType> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/rp-payment-type`;
  }
}
