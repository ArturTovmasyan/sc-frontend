import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PaymentSource} from '../models/payment-source';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class PaymentSourceService extends GridService<PaymentSource> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/payment/source`;
  }
}
