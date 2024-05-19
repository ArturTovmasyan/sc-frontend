import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Contact} from '../models/contact';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class ContactService extends GridService<Contact> {
  constructor(http: HttpClient) {
    super(http);

    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/contact`;
  }
}
