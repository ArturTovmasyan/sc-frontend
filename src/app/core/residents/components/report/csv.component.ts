import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {TitleService} from '../../../services/title.service';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {KeyValue} from '@angular/common';

@Component({
  templateUrl: './csv.component.html'
})
export class CSVComponent implements OnInit, OnDestroy {
  title: string = null;
  data: string[][];

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
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
          .reportAsObservable(params.config.group_alias, params.config.report_alias, 'csv', params.params)
          .pipe(first()).subscribe(res => {
            if (res) {
              const reader: FileReader = new FileReader();
              reader.onloadend = (file) => {
                const rows = (reader.result as string).split(/[\r\n]+/);

                for (let i = 0; i < rows.length; i++) {
                  const cols = this.csv2array(rows[i]);
                  if (cols !== null) {
                    this.data.push(cols);
                  }
                }
              };
              reader.readAsText(res.body);
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

  private csv2array(text) {
    const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) {
      return null;
    }

    const a = [];                     // Initialize array to receive values.
    // "Walk" the string using replace with callback.
    text.replace(re_value, (m0, m1, m2, m3) => {
      if (m1 !== undefined) {
        // Remove backslash from \' in single quoted values.
        a.push(m1.replace(/\\'/g, '\''));
      } else if (m2 !== undefined) {
        // Remove backslash from \" in double quoted values.
        a.push(m2.replace(/\\"/g, '"'));
      } else if (m3 !== undefined) {
        a.push(m3);
      }
      return ''; // Return empty string.
    });

    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) {
      a.push('');
    }
    return a;
  }

  public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }
}
