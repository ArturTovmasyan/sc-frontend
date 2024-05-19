import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {MedicationFormFactor} from '../models/medication-form-factor';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class MedicationFormFactorService extends GridService<MedicationFormFactor> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/medication/form/factor`;
  }
}
