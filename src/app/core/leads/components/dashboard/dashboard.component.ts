import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {TitleService} from '../../../services/title.service';
import {AuthGuard} from '../../../guards/auth.guard';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private title$: TitleService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('param_id');
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
