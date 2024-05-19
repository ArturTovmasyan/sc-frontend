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

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident`;
  }

  public put_photo(data: any): Observable<any> {
    return this.http.put<Message>(this.SERVICE_URL_BASE + `/${data.id}/photo`, data);
  }

}
