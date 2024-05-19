import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Region} from '../models/region';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class RegionService extends GridService<Region> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/region`;
  }
}
