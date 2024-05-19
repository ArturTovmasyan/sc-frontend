import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {FacilityDiningRoom} from '../models/facility-dining-room';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class FacilityDiningRoomService extends GridService<FacilityDiningRoom> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility/dining/room`;
  }
}
