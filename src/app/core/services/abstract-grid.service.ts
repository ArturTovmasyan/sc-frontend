import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {formatDate} from '@angular/common';

export abstract class AbstractGridService {
  protected abstract options(): Observable<any>;

  protected abstract list(page: number,
                          per_page: number,
                          sort: { key: string, value: string }[],
                          filter: { [id: string]: { condition: number, value: any[] } }): Observable<any>;

  protected build_query(page: number,
                        per_page: number,
                        sort: { key: string, value: string }[],
                        filter: { [id: string]: { condition: number, value: any[] } }): HttpParams {
    let params = new HttpParams()
      .append('page', `${page}`)
      .append('per_page', `${per_page}`);

    sort.forEach(sort_config => {
      params = params.append('sort[' + sort_config.key + ']', sort_config.value.replace('end', ''));
    });

    Object.entries(filter).forEach(
      ([key, value]) => {
        if (value.condition != null) {
          params = params.append('filter[' + key + '][c]', `${value.condition}`);
        }
        if (value.value != null) {
          value.value.forEach((v, i) => {
            if (v != null) {
              if (v instanceof Date) {
                v = formatDate(v, 'yyy-MM-ddTHH:mm:ss', 'en-US');
              }

              params = params.append('filter[' + key + '][v][' + i + ']', v);
            }
          });
        }
      }
    );

    return params;
  }

}
