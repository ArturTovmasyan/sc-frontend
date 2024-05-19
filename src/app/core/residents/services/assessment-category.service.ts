import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AssessmentCategory} from '../models/assessment-category';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class AssessmentCategoryService extends GridService<AssessmentCategory> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/assessment/category`;
  }
}
