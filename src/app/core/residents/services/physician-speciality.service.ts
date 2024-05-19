import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PhysicianSpeciality} from '../models/physician-speciality';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class PhysicianSpecialityService extends GridService<PhysicianSpeciality> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/speciality`;
  }
}
