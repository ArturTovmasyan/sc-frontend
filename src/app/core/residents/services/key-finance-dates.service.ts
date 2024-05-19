import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {KeyFinanceDates} from '../models/key-finance-dates';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class KeyFinanceDatesService extends GridService<KeyFinanceDates> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/key-finance-dates`;
  }
}
