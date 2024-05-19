import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Organization} from '../models/organization';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class OrganizationService extends GridService<Organization> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/organization`;
  }
}
