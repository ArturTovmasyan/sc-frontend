import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {first} from 'rxjs/operators';
import {saveFile} from '../../../shared/helpers/file-download-helper';
import {ResidentSelectorService} from './resident-selector.service';

@Injectable({providedIn: 'root'})
export class ReportService {
  protected SERVICE_URL_BASE;

  constructor(
    protected http: HttpClient,
    private residentSelector$: ResidentSelectorService
  ) {
    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/report`;
  }

  public list() {
    return this.http.get(this.SERVICE_URL_BASE + `/list`);
  }

  public report(group_alias, report_alias, format, params, callback: any, error_callback: any) {
    return this.reportAsObservable(group_alias, report_alias, format, params, false)
      .pipe(first())
      .subscribe(response => {
          saveFile(response);
          callback();
        },
        error => {
          error_callback(error);
        });
  }

  public reportAsObservable(group_alias, report_alias, format, params, hash: boolean = false) {
    const request_params = this.create_request_params(format, params, hash);

    const options = {
      params: request_params
    };

    if (hash === false) {
      options['responseType'] = 'blob';
      options['observe'] = 'response';
    }

    return this.http.get<any>(this.SERVICE_URL_BASE + `/${group_alias}/${report_alias}`, options);
  }

  private create_request_params(format, params, hash: boolean = false): HttpParams {
    let request_params = new HttpParams().append('format', format);

    if (!_.isNil(params.group)) {
      request_params = request_params.append('type', params.group);
    }
    if (!_.isNil(params.group_id)) {
      request_params = request_params.append('type_id', params.group_id);
    }
    if (!_.isNil(params.group_all) && (params.group_all === true || params.group_all === 'true')) {
      request_params = request_params.append('type_all', params.group_all);
    }
    if (!_.isNil(params.resident_id)) {
      request_params = request_params.append('resident_id', params.resident_id);
    }
    if (!_.isNil(params.resident_all) && (params.resident_all === true || params.resident_all === 'true')) {
      request_params = request_params.append('resident_all', params.resident_all);
    }

    if (!_.isNil(params.date)) {
      request_params = request_params.append('date', params.date.toISOString());
    }
    if (!_.isNil(params.date_from)) {
      request_params = request_params.append('date_from', params.date_from.toISOString());
    }
    if (!_.isNil(params.date_to)) {
      request_params = request_params.append('date_to', params.date_to.toISOString());
    }

    if (!_.isNil(params.assessment_id)) {
      request_params = request_params.append('assessment_id', params.assessment_id);
    }

    if (!_.isNil(params.assessment_form_id)) {
      request_params = request_params.append('assessment_form_id', params.assessment_form_id);
    }

    if (!_.isNil(params.discontinued) && (params.discontinued === true || params.discontinued === 'true')) {
      request_params = request_params.append('discontinued', '1');
    }

    if (hash) {
      request_params = request_params.append('hash', '1');
    }

    return request_params;
  }
}
