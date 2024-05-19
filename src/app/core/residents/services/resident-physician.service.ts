import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentPhysician} from '../models/resident-physician';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';
import {Message} from '../../models/message';

@Injectable({providedIn: 'root'})
export class ResidentPhysicianService extends GridService<ResidentPhysician> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/physician`;
  }

  get_primary(resident_id: number) {
    return this.http.get<ResidentPhysician>(this.SERVICE_URL_BASE + `/${resident_id}/primary`);
  }

  public reorder(data: ResidentPhysician): Observable<any> {
    return this.http.post<Message>(this.SERVICE_URL_BASE + `/reorder`, data);
  }
}
