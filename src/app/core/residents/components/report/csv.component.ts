import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {TitleService} from '../../../services/title.service';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './csv.component.html'
})
export class CSVComponent implements OnInit, OnDestroy {
  protected title: string = null;

  protected data: string[][];

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private report$: ReportService,
    private title$: TitleService,
    private route$: ActivatedRoute
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
        break;
      case 'get_report':
        this.$subscriptions[key] = this.report$.reportAsObservable(null, null, null, null).pipe(first()).subscribe(res => {
          if (res) {
            const reader: FileReader = new FileReader();
            reader.onloadend = (file) => {
              const rows = (reader.result as string).split(/[\r\n]+/);

              for (let i = 0; i < rows.length; i++) {
                const cols = rows[i].split(',');

                this.data.push(cols);
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

}
