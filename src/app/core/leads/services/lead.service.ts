import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Lead} from '../models/lead';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class LeadService extends GridService<Lead> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/lead`;
  }

  public spam(ids: number[], state: boolean) {
    return this.http.put<any>(this.SERVICE_URL_BASE + `/spam`, {ids: ids, spam: state});
  }
}
