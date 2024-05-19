import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {HospiceProvider} from '../models/hospice-provider';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class HospiceProviderService extends GridService<HospiceProvider> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/hospice-provider`;
  }
}
