import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Resident} from '../models/resident';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';
import {Message} from '../../models/message';

@Injectable({providedIn: 'root'})
export class ResidentService extends GridService<Resident> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident`;
  }

  list_by_options(state: boolean, type: number, type_id: number): Observable<Resident[]> {
    let prefix = '';
    let suffix = '';

    if (type == null && type_id == null) {
      prefix = 'no-contract';
    } else {
      if (state) {
        prefix = 'active';
      } else {
        prefix = 'inactive';
      }
      suffix = `/${type}/${type_id}`;
    }

    return this.http.get<Resident[]>(this.SEVICE_URL_BASE + `/${prefix}${suffix}`);
  }

  public put_photo(data: any): Observable<any> {
    return this.http.put<Message>(this.SEVICE_URL_BASE + `/${data.id}/photo`, data);
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

    return this.http.put<Message>(this.SEVICE_URL_BASE + `/${data.id}/move`, request_data);
  }
}
