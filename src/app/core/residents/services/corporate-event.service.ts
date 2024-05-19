import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CorporateEvent} from '../models/corporate-event';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class CorporateEventService extends GridService<CorporateEvent> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/corporate/event`;
  }

  isDone(id: number) {
    return this.http.get<any>(this.SERVICE_URL_BASE + `/done/${id}`);
  }

  setDone(id: number) {
    return this.http.post<any>(this.SERVICE_URL_BASE + `/done/${id}`, {done: 1});
  }
}
