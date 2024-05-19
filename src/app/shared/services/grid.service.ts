import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {first} from 'rxjs/operators';
import {saveFile} from '../helpers/file-download-helper';
import {Message} from '../../core/models/message';

export class GridService<T extends IdInterface> {
  protected SEVICE_URL_BASE;

  protected constructor(protected http: HttpClient) {
  }

  all(): Observable<T[]> {
    return this.http.get<T[]>(this.SEVICE_URL_BASE);
  }

  public options(): Observable<any> {
    return this.http.options(this.SEVICE_URL_BASE + '/grid');
  }

  public list(page: number,
              per_page: number,
              sort: { key: string, value: string }[],
              filter: { [id: string]: { condition: number, value: any[] } },
              params?: { key: string, value: string }[]
  ): Observable<T[]> {

    return this.http.get<T[]>(
      this.SEVICE_URL_BASE + '/grid',
      {
        params: this.build_query(page, per_page, sort, filter, params)
      });
  }

  public pdf(callback: any) {
    return this.http
      .get(this.SEVICE_URL_BASE + '/list', {
        responseType: 'blob',
        observe: 'response',
        params: new HttpParams().append('pdf', '1')
      })
      .pipe(first())
      .subscribe(response => {
        saveFile(response);
        callback();
      });
  }

  public removeBulk(ids: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {ids: ids},
    };

    return this.http.delete(this.SEVICE_URL_BASE, options);
  }

  public get(id: number): Observable<T> {
    return this.http.get<T>(this.SEVICE_URL_BASE + `/${id}`);
  }

  public add(data: T): Observable<any> {
    return this.http.post<Message>(this.SEVICE_URL_BASE, data);
  }

  public edit(data: T): Observable<any> {
    return this.http.put<Message>(this.SEVICE_URL_BASE + `/${data.id}`, data);
  }

  private build_query(page: number,
                      per_page: number,
                      sort: { key: string, value: string }[],
                      filter: { [id: string]: { condition: number, value: any[] } },
                      params?: { key: string, value: string }[]
  ): HttpParams {
    let query = new HttpParams()
      .append('page', `${page}`)
      .append('per_page', `${per_page}`);

    sort.forEach(sort_config => {
      query = query.append('sort[' + sort_config.key + ']', sort_config.value.replace('end', ''));
    });

    Object.entries(filter).forEach(
      ([key, value]) => {
        if (value.condition != null) {
          query = query.append('filter[' + key + '][c]', `${value.condition}`);
        }
        if (value.value != null) {
          value.value.forEach((v, i) => {
            if (v != null) {
              if (v instanceof Date) {
                v = formatDate(v, 'yyy-MM-ddTHH:mm:ss', 'en-US');
              }

              query = query.append('filter[' + key + '][v][' + i + ']', v);
            }
          });
        }
      }
    );

    if (params) {
      params.forEach(param => {
        query = query.append(param.key, param.value);
      });
    }

    return query;
  }

}
