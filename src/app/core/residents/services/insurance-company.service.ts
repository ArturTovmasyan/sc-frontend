import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {InsuranceCompany} from '../models/insurance-company';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class InsuranceCompanyService extends GridService<InsuranceCompany> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/insurance/company`;
  }
}
