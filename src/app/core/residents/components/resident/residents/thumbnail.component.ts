import {Component, OnDestroy, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import {ResidentService} from '../../../services/resident.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {GroupType} from '../../../models/group-type.enum';

@Component({
  templateUrl: './thumbnail.component.html',
  providers: []
})
export class ThumbnailComponent implements OnInit, OnDestroy {
  GROUP_TYPE = GroupType;
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  data: any;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    protected service$: ResidentService,
    protected route$: ActivatedRoute,
  ) {
    this.$subscriptions = {};

  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  ngOnInit(): void {
    this.subscribe('segment');
  }

  protected subscribe(key: string) {
    this.unsubscribe(key);
    switch (key) {
      case 'segment':
        this.$subscriptions[key] = this.route$.url.subscribe(value => {
          const params = [];

          if (value && value.length > 0) {
            if (value.length === 1) {
              params.push({key: 'state', value: value[0].path});
            } else if (value.length === 2) {
              params.push({key: 'type', value: value[0].path});
              params.push({key: 'type_id', value: value[1].path});
            }
          }

          this.service$.all(params).pipe(first()).subscribe(res => {
            if (res) {
              this.data = res;
            }
          });

        });
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }
}
