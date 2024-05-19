import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ResidentService} from '../../services/resident.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './resident/form/form.component';
import {Resident} from '../../models/resident';
import {RouterParams} from '../../../services/router-params';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentService]
})
export class ListComponent extends GridComponent<Resident, ResidentService> implements OnInit, OnDestroy {
  $init: BehaviorSubject<boolean>;

  constructor(
    protected service$: ResidentService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    protected route$: ActivatedRoute,
    protected route_params: RouterParams
  ) {
    super(service$, title$, modal$);

    this.$init = new BehaviorSubject<boolean>(false);

    this.component = FormComponent;

    this.name = 'resident-list';
  }

  ngOnInit(): void {
    this.$subscriptions['segment'] = this.route$.url.subscribe(value => {
      if (value && value.length > 0) {
        if (value.length === 1) {
          this.params.push({key: 'state', value: value[0].path});
        } else if (value.length === 2) {
          this.params.push({key: 'type', value: value[0].path});
          this.params.push({key: 'type_id', value: value[1].path});
        }

        this.$init.next(true);
      } else {
        this.$init.next(true);
      }
    });

    this.$subscriptions['init'] = this.$init.subscribe(value => {
      if (value) {
        super.init();
      }
    });
  }
}
