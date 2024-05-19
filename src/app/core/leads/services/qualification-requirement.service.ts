import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {QualificationRequirement} from '../models/qualification-requirement';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class QualificationRequirementService extends GridService<QualificationRequirement> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/qualification-requirement`;
  }
}
