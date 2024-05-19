import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {GridService} from '../../shared/services/grid.service';
import {Space} from '../models/space';

@Injectable({providedIn: 'root'})
export class SpaceService extends GridService<Space> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/space`;
  }
}
