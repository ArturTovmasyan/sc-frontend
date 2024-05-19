import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CurrentResidence} from '../models/current-residence';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class CurrentResidenceService extends GridService<CurrentResidence> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/current-residence`;
  }
}
