import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Salutation} from '../models/salutation';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class SalutationService extends GridService<Salutation> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/salutation`;
  }
}
