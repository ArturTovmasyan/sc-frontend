import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {StageChangeReason} from '../models/stage-change-reason';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class StageChangeReasonService extends GridService<StageChangeReason> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/stage-change-reason`;
  }
}
