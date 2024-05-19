import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Lead} from '../models/lead';
import {GridService} from '../../../shared/services/grid.service';
import {Message} from '../../models/message';

@Injectable({providedIn: 'root'})
export class LeadService extends GridService<Lead> {
    constructor(http: HttpClient) {
        super(http);

        this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/lead/lead`;
    }

    public spam(ids: number[], state: boolean) {
        return this.http.put<any>(this.SERVICE_URL_BASE + `/spam`, {ids: ids, spam: state});
    }

    public interest(data) {
        return this.http.put<Message>(this.SERVICE_URL_BASE + `/${data.id}/interest`, data);
    }

    public expand(expand: boolean) {
        return this.http.put<any>(this.SERVICE_URL_BASE + `/expand`, {expand: expand});
    }

    public getExpand() {
        return this.http.get<any>(this.SERVICE_URL_BASE + `/expand`, {});
    }

    public resident(data) {
        return this.http.post<Message>(this.SERVICE_URL_BASE + `/${data.id}/resident`, data);
    }

    public admission(data) {
        return this.http.post<Message>(this.SERVICE_URL_BASE + `/${data.id}/admission`, data);
    }
}
