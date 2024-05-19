import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LeadTemperature} from '../models/lead-temperature';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class LeadTemperatureService extends GridService<LeadTemperature> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/lead-temperature`;
  }
}
