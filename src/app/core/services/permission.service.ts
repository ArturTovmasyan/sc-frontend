import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {GridService} from '../../shared/services/grid.service';
import {Permission} from '../models/permission';

@Injectable({providedIn: 'root'})
export class PermissionService extends GridService<Permission> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/permission`;
  }
}
