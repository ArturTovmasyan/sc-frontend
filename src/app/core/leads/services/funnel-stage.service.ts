import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {FunnelStage} from '../models/funnel-stage';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class FunnelStageService extends GridService<FunnelStage> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/funnel-stage`;
  }
}
