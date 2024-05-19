import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {TitleService} from '../../../services/title.service';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Papa} from 'ngx-papaparse';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';

@Component({
  templateUrl: './csv.component.html'
})
export class CSVComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  title: string = null;
  url: any = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private report$: ReportService,
    private title$: TitleService,
    private route$: ActivatedRoute,
    private papa$: Papa
  ) {
    this.title$.getTitle().subscribe(v => this.title = v);

    this.$subscriptions = {};
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
              group_ids: query['group_ids'],
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
          .reportAsObservable(params.config.group_alias, params.config.report_alias, 'xls', params.params, true)
          .pipe(first()).subscribe(res => {
            if (res != null && Array.isArray(res) && res.length === 1) {
              const report_url = this.report$.reportURLbyHash(res[0]);
              this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${report_url}`);
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
}
