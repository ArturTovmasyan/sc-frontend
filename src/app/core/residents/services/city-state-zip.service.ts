import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CityStateZip} from '../models/city-state-zip';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class CityStateZipService extends GridService<CityStateZip> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/city/state/zip`;
  }
}
