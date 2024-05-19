import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Hobby} from '../models/hobby';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class HobbyService extends GridService<Hobby> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/hobby`;
  }
}
