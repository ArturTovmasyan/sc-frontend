import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Relationship} from '../models/relationship';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class RelationshipService extends GridService<Relationship> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/relationship`;
  }
}
