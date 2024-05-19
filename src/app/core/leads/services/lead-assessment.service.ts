import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LeadAssessment} from '../models/lead-assessment';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class LeadAssessmentService extends GridService<LeadAssessment> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/lead/assessment`;
    // this.REPORT_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/report/assessment`;
  }

  // public report(id: number, type: AssessmentReportType, callback: any) {
  //   return this.http
  //     .get(this.REPORT_URL_BASE, {
  //       responseType: 'blob',
  //       observe: 'response',
  //       params: new HttpParams()
  //         .append('format', 'pdf')
  //         .append('type', type.toString())
  //         .append('id', id.toString())
  //     })
  //     .pipe(first())
  //     .subscribe(response => {
  //       saveFile(response);
  //       callback();
  //     });
  // }
}
