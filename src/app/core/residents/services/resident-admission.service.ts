import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentAdmission} from '../models/resident-admission';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResidentAdmissionService extends GridService<ResidentAdmission> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/admission`;
  }

  public active(resident_id: number): Observable<ResidentAdmission> {
    return this.http.get<ResidentAdmission>(this.SEVICE_URL_BASE + `/${resident_id}/active`);
  }
}
