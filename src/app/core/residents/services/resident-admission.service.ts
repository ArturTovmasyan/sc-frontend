import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {GridService} from '../../../shared/services/grid.service';
import {ResidentAdmission} from '../models/resident-admission';
import {Resident} from '../models/resident';
import {Message} from '../../models/message';

@Injectable({providedIn: 'root'})
export class ResidentAdmissionService extends GridService<ResidentAdmission> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/admission`;
  }

  public active(resident_id: number): Observable<ResidentAdmission> {
    return this.http.get<ResidentAdmission>(this.SERVICE_URL_BASE + `/${resident_id}/active`);
  }

  list_by_options(state: boolean, type: number, type_id: number): Observable<Resident[]> {
    let prefix = '';
    let suffix = '';

    if (type == null && type_id == null) {
      prefix = 'no-admission';
    } else {
      if (state) {
        prefix = 'active';
      } else {
        prefix = 'inactive';
      }
      suffix = `/${type}/${type_id}`;
    }

    return this.http.get<Resident[]>(this.SERVICE_URL_BASE + `/${prefix}${suffix}`);
  }

  public move(data: any): Observable<any> { // TODO(haykg): review when backend will be ready
    const request_data = {id: data.id};

    if (data.group_id) {
      request_data['group_type'] = data.group_type;
      request_data['group_id'] = data.group_id;
    }

    if (data.bed_id) {
      request_data['bed_id'] = data.bed_id;
    }

    return this.http.put<Message>(this.SERVICE_URL_BASE + `/${data.id}/move`, request_data);
  }
}
