import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {FacilityRoomType} from '../models/facility-room-type';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class FacilityRoomTypeService extends GridService<FacilityRoomType> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility-room-type`;
  }
}
