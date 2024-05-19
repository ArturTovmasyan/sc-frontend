import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentLedger} from '../models/resident-ledger';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ResidentLedgerService extends GridService<ResidentLedger> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/ledger`;
  }
}