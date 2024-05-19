import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AssessmentCareLevel} from '../models/assessment-care-level';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class AssessmentCareLevelService extends GridService<AssessmentCareLevel> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/assessment/care/level`;
  }
}
