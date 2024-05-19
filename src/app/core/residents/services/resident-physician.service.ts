import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentPhysician} from '../models/resident-physician';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ResidentPhysicianService extends GridService<ResidentPhysician> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/physician`;
  }

  get_primary(resident_id: number) {
    return this.http.get<ResidentPhysician>(this.SERVICE_URL_BASE + `/${resident_id}/primary`);
  }
}
