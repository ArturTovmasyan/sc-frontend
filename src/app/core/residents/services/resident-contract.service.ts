import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {ResidentContract} from '../models/resident-contract';
import {GridService} from '../../../shared/services/grid.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResidentContractService extends GridService<ResidentContract> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/contract`;
  }

  public active(resident_id: number): Observable<ResidentContract> {
    return this.http.get<ResidentContract>(this.SEVICE_URL_BASE + `/${resident_id}/active`);
  }
}
