import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {GridService} from '../../../shared/services/grid.service';
import {ResidentAdmission} from '../models/resident-admission';
import {Resident} from '../models/resident';
import {Message} from '../../models/message';

class PagedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  data: T[];
}

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

    request_data['group_type'] = data.group_type;

    if (data.group_id) {
      request_data['move_id'] = data.group_id;
    }

    if (data.bed_id) {
      request_data['move_id'] = data.bed_id;
    }

    return this.http.put<Message>(this.SERVICE_URL_BASE + `/${data.id}/move`, request_data);
  }

  list_by_page(params: {key: any, value: any}[]): Observable<PagedResponse<Resident>> {
    let query = new HttpParams();
    if (params) {
      params.forEach(param => {
        query = query.append(param.key, param.value);
      });
    }

    let state = query.get('state');
    const page = query.get('page');
    const per_page = query.get('per_page');

    const type = query.get('type');
    const type_id = query.get('type_id');

    if (state === null || state === undefined) {
      state = 'active';
    }

    let url_segment = `${state}/${page}/${per_page}`;

    if (type !== null && type_id !== null && type !== undefined && type_id !== undefined) {
      url_segment += `/${type}/${type_id}`;
    }

    return this.http.get<PagedResponse<Resident>>(`${this.SERVICE_URL_BASE}/${url_segment}`);
  }
}
