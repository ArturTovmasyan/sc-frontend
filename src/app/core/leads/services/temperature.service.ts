import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Temperature} from '../models/temperature';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class TemperatureService extends GridService<Temperature> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/temperature`;
  }
}
