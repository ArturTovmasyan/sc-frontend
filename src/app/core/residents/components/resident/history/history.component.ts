import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TitleService} from '../../../../services/title.service';

@Component({
  selector: 'app-resident-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {
  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private title$: TitleService
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'title':
        this.$subscriptions[key] = this.title$.getTitle().subscribe(v => this.title = v);
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
