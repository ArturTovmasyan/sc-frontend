import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentExpenseItem} from '../models/resident-expense-item';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ResidentExpenseItemService extends GridService<ResidentExpenseItem> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident-expense-item`;
  }
}
