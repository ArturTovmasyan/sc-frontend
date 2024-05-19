import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PaymentSourceBaseRate} from '../models/payment-source-base-rate';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class PaymentSourceBaseRateService extends GridService<PaymentSourceBaseRate> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/payment-source-base-rate`;
  }
}
