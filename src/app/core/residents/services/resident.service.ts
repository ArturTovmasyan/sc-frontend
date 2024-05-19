import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Resident} from '../models/resident';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';
import {Message} from '../../models/message';
import {ResidentAdmission} from '../models/resident-admission';

@Injectable({providedIn: 'root'})
export class ResidentService extends GridService<Resident> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident`;
  }

  public put_photo(data: any): Observable<any> {
    return this.http.put<Message>(this.SERVICE_URL_BASE + `/${data.id}/photo`, data);
  }

  public last_admission(id: number): Observable<ResidentAdmission> {
    return this.http.get<ResidentAdmission>(this.SERVICE_URL_BASE + `/last/admission/${id}`);
  }

  public state(resident_id: number): Observable<any> {
    return this.http.get<any>(this.SERVICE_URL_BASE + `/state/${resident_id}`);
  }

  public calendar(resident_id: any, date_from: Date, date_to: Date) {
    return this.http.get<any>(this.SERVICE_URL_BASE + `/calendar/${resident_id}`); // ?date_from=${date_from}&date_to=${date_to}
  }
}
