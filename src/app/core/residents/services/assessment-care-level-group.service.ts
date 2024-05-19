import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AssessmentCareLevelGroup} from '../models/assessment-care-level-group';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class AssessmentCareLevelGroupService extends GridService<AssessmentCareLevelGroup> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/assessment/care/level/group`;
  }
}
