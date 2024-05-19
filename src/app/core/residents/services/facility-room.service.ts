import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {FacilityRoom} from '../models/facility-room';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class FacilityRoomService extends GridService<FacilityRoom> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility/room`;
  }
}
