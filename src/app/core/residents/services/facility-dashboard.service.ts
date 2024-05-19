import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {GridService} from '../../../shared/services/grid.service';
import {FacilityDashboard} from '../models/facility-dashboard';
import {saveFile} from "../../../shared/helpers/file-download-helper";
import {first} from "rxjs/internal/operators";

@Injectable({providedIn: 'root'})
export class FacilityDashboardService extends GridService<FacilityDashboard> {
    constructor(http: HttpClient) {
        super(http);

        this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/facility-dashboard`;
    }

    public getCsvReport(date_from: string, date_to: string, callback: any, error_callback: any) {
        return this.http.get(this.SERVICE_URL_BASE + `/csv`, {
            params: {
                date_from: date_from,
                date_to: date_to
            },
            responseType: 'blob',
            observe: 'response'
        }).pipe(first())
            .subscribe(response => {
                    saveFile(response);
                    callback();
                },
                error => {
                    error_callback(error);
                });
    }
}
