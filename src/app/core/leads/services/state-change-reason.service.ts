import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {StateChangeReason} from '../models/state-change-reason';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class StateChangeReasonService extends GridService<StateChangeReason> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/state-change-reason`;
  }
}
