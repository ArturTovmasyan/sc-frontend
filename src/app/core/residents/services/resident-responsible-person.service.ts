import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentResponsiblePerson} from '../models/resident-responsible-person';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';
import {Message} from '../../models/message';

@Injectable({providedIn: 'root'})
export class ResidentResponsiblePersonService extends GridService<ResidentResponsiblePerson> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/responsible/person`;
  }

  public reorder(data: ResidentResponsiblePerson): Observable<any> {
    return this.http.post<Message>(this.SERVICE_URL_BASE + `/reorder`, data);
  }
}
