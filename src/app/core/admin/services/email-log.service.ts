import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {GridService} from '../../../shared/services/grid.service';
import {EmailLog} from '../../models/email-log';

@Injectable({providedIn: 'root'})
export class EmailLogService extends GridService<EmailLog> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/email-log`;
  }
}
