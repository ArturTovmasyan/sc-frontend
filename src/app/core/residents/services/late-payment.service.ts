import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LatePayment} from '../models/late-payment';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class LatePaymentService extends GridService<LatePayment> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/late-payment`;
  }
}
