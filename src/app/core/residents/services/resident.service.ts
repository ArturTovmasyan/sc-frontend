import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Resident} from '../models/resident';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResidentService extends GridService<Resident> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident`;
  }

  list_by_options(group_id: number, type: number, state: number): Observable<Resident[]> {
    return this.http.get<Resident[]>(this.SEVICE_URL_BASE + `/type/${type}/${group_id}/state/${state}`);
  }
}
