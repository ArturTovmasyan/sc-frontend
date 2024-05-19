import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {EmailReviewType} from '../models/email-review-type';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class EmailReviewTypeService extends GridService<EmailReviewType> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/email-review-type`;
  }
}
