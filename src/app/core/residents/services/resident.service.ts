import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Resident} from '../models/resident';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ResidentService extends GridService<Resident> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident`;
  }
}
