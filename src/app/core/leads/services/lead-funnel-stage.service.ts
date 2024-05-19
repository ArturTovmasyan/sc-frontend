import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LeadFunnelStage} from '../models/lead-funnel-stage';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class LeadFunnelStageService extends GridService<LeadFunnelStage> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/lead-funnel-stage`;
  }
}
