import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {TitleService} from '../../../services/title.service';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {KeyValue} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {environment} from '../../../../../environments/environment';

@Component({
  templateUrl: './csv.component.html'
})
export class CSVComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  title: string = null;
  data: string[][];

  url = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private report$: ReportService,
    private title$: TitleService,
    private route$: ActivatedRoute
  ) {
    this.title$.getTitle().subscribe(v => this.title = v);

    this.$subscriptions = {};

    this.data = [];
  }

  ngOnInit(): void {
    this.subscribe('param');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'param':
        this.route$.queryParams.subscribe(query => {
          this.subscribe('get_report', {
            config: {
              group_alias: query['g'],
              report_alias: query['r'],
            },
            params: {
              group: query['group'],
              group_id: query['group_id'],
              group_all: query['group_all'],

              resident_id: query['resident_id'],
              resident_all: query['resident_all'],

              assessment_id: query['assessment_id'],
              assessment_form_id: query['assessment_form_id'],
              discontinued: query['discontinued'],

              date: query['date'] ? new Date(query['date']) : null,
              date_from: query['date_from'] ? new Date(query['date_from']) : null,
              date_to: query['date_to'] ? new Date(query['date_to']) : null
            }
          });
        });
        break;
      case 'get_report':
          this.$subscriptions[key] = this.report$
            .reportAsObservable(params.config.group_alias, params.config.report_alias, 'csv', params.params, true)
            .pipe(first()).subscribe(res => {
            if (res != null && Array.isArray(res) && res.length === 1) {
              const url = 'https://sheet.zoho.com/sheet/importview.do?url='
                + encodeURI(`${environment.apiUrl}/api/v1.0/report/csv-view/` + res[0]);

              console.log(url);

              this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            }
          });
        break;
      default:
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }
}
