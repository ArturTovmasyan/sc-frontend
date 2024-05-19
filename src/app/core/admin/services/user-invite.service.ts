import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {UserInvite} from '../../models/user-invite';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class UserInviteService extends GridService<UserInvite> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/user/invite`;
  }
}
