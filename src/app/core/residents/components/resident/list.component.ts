import * as _ from 'lodash';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ResidentService} from '../../services/resident.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './resident/form/form.component';
import {Resident} from '../../models/resident';
import {RouterParams} from '../../../services/router-params';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentService]
})
export class ListComponent extends GridComponent<Resident, ResidentService> implements OnInit, OnDestroy {
  constructor(
    protected service$: ResidentService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    protected route_params: RouterParams
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'resident-list';
  }

  ngOnInit(): void {
    super.init();

    this.$subscriptions['param'] = this.route_params.params.subscribe((params: Array<any>): void => {
      if (params) {
        params = params.filter(v =>
          v.params.hasOwnProperty('type') !== -1 &&
          v.params.hasOwnProperty('group') !== -1 &&
          _.indexOf(v.url, 'residents') !== -1
        );

        if (params.length > 0) {
          this.params.push({key: 'type', value: params[0].params.type});
          this.params.push({key: 'type_id', value: params[0].params.group});
        }
      }

      super.init();
    });
  }
}
