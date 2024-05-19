import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {WebEmail} from '../models/web-email';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class WebEmailService extends GridService<WebEmail> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/web-email`;
  }
}
