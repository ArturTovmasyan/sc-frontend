import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TitleService} from '../../../../services/title.service';
import {ActivatedRoute} from '@angular/router';
import {AuthGuard} from '../../../../guards/auth.guard';

@Component({
  templateUrl: './event.component.html'
})
export class EventComponent implements OnInit, OnDestroy {
  public title: string = null;
  public mode: boolean = false;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private title$: TitleService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  public checkPermission(expected_permissions: string[]): boolean {
    return this.auth_$.checkPermission(expected_permissions);
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
