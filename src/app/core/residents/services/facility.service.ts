import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Facility} from '../models/facility';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class FacilityService extends GridService<Facility> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility`;
  }

  public calendar(resident_id: any, date_from: Date, date_to: Date) {
    return this.http.get<any>(this.SERVICE_URL_BASE + `/calendar/${resident_id}`); // ?date_from=${date_from}&date_to=${date_to}
  }

}
