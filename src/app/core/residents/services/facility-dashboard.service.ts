import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {GridService} from '../../../shared/services/grid.service';
import {FacilityDashboard} from '../models/facility-dashboard';

@Injectable({providedIn: 'root'})
export class FacilityDashboardService extends GridService<FacilityDashboard> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility-dashboard`;
  }

}
