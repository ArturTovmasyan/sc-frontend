import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {FacilityEvent} from '../models/facility-event';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class FacilityEventService extends GridService<FacilityEvent> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility/event`;
  }
}
