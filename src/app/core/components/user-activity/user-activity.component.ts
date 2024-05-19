import {Component, Input, OnInit} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {Router} from '@angular/router';
import {ChangeLogService} from '../../admin/services/change-log.service';
import {Subscription, timer} from 'rxjs';
import {first} from 'rxjs/operators';
import {ChangeLog} from '../../models/change-log';
import {ChangeLogType} from '../../models/change-log-type.enum';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
})
export class UserActivityComponent implements OnInit {
  ChangeLogType = ChangeLogType;

  @Input('asideVisible') asideVisible: boolean|string;

  public change_logs: ChangeLog[];

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private change_log$: ChangeLogService
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('timer_change_log');
  }

  protected subscribe(key: string) {
    this.unsubscribe(key);
    switch (key) {
      case 'list_change_log':
        this.$subscriptions[key] = this.change_log$.all().subscribe(res => {
          if (res) {
            this.change_logs = res;

            if (this.change_logs.length > 0) {
              this.asideVisible = 'lg';
            } else {
              this.asideVisible = false;
            }
          }
          // this.subscribe('timer_change_log');
        });
        break;
      case 'timer_change_log':
        this.$subscriptions[key] =
          timer(5000).pipe(first()).subscribe(() => this.subscribe('list_change_log'));
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

}
