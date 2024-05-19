import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentRent} from '../models/resident-rent';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResidentRentService extends GridService<ResidentRent> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/rent`;
  }

  public remove(data: any): Observable<any> {
    return this.http.delete<any>(this.SERVICE_URL_BASE + `/${data.id}`, {});
  }

  public getResidentLastRent(id: number) {
    return this.http.get<any>(this.SERVICE_URL_BASE + `/${id}/last`, {});
  }
}
