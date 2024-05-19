import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {KeyFinanceType} from '../models/key-finance-type';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class KeyFinanceTypeService extends GridService<KeyFinanceType> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/key-finance-type`;
  }
}
