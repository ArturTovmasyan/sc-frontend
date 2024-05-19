import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Apartment} from '../models/apartment';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ApartmentService extends GridService<Apartment> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/apartment`;
  }
}
