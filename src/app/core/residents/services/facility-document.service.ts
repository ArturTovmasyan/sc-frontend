import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {GridService} from '../../../shared/services/grid.service';
import {FacilityDocument} from '../models/facility-document';
import {first} from 'rxjs/operators';
import {saveFile} from '../../../shared/helpers/file-download-helper';

@Injectable({providedIn: 'root'})
export class FacilityDocumentService extends GridService<FacilityDocument> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility/document`;
  }

  public download(id: number, callback: any, error_callback: any) {
    return this.http
      .get(this.SERVICE_URL_BASE + `/download/${id}`, {
        responseType: 'blob',
        observe: 'response'
      })
      .pipe(first())
      .subscribe(response => {
          saveFile(response);
          callback();
        },
        error => {
          error_callback(error);
        });
  }
}
