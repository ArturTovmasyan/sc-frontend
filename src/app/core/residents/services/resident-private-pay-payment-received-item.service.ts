import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentPrivatePayPaymentReceivedItem} from '../models/resident-private-pay-payment-received-item';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ResidentPrivatePayPaymentReceivedItemService extends GridService<ResidentPrivatePayPaymentReceivedItem> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident-private-pay-payment-received-item`;
  }
}
