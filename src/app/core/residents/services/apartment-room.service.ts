import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ApartmentRoom} from '../models/apartment-room';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ApartmentRoomService extends GridService<ApartmentRoom> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/apartment/room`;
  }

  last_number(apartment_id: number) {
    return  this.http.get(this.SEVICE_URL_BASE + `/${apartment_id}/last`);
  }
}
