import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AssessmentReportType, ResidentAssessment} from '../models/resident-assessment';
import {GridService} from '../../../shared/services/grid.service';
import {first} from 'rxjs/operators';
import {saveFile} from '../../../shared/helpers/file-download-helper';

@Injectable({providedIn: 'root'})
export class ResidentAssessmentService extends GridService<ResidentAssessment> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/assessment`;
    this.REPORT_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/report/assessment`;
  }

  public report(id: number, type: AssessmentReportType, callback: any) {
    return this.http
      .get(this.REPORT_URL_BASE, {
        responseType: 'blob',
        observe: 'response',
        params: new HttpParams()
          .append('format', 'pdf')
          .append('type', type.toString())
          .append('id', id.toString())
      })
      .pipe(first())
      .subscribe(response => {
        saveFile(response);
        callback();
      });
  }
}
