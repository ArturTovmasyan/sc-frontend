import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {HelpCategory} from '../models/help-category';
import {GridService} from '../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class HelpService extends GridService<HelpCategory> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/help`;
  }
}
