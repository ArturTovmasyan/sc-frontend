import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentService} from '../../../services/resident.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from '../resident/form/form.component';
import {Resident} from '../../../models/resident';
import {RouterParams} from '../../../../services/router-params';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-residents-list',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentService]
})
export class ListComponent extends GridComponent<Resident, ResidentService> implements OnInit, OnDestroy {
  @Input('options') set options(options: { state?: string, type?: number, type_id?: number }) {
    this.remove_param('state');
    this.remove_param('type');
    this.remove_param('type_id');

    if (options !== undefined && options !== null) {
      if (options.state !== undefined && options.state !== null) {
        this.add_param('state', options.state);
      } else {
        this.add_param('state', 'active');
      }

      if (options.type !== undefined && options.type_id !== undefined && options.type !== null && options.type_id !== null) {
        this.add_param('type', options.type.toString());
        this.add_param('type_id', options.type_id.toString());
      }

      super.init();
    }
  }

  constructor(
    protected service$: ResidentService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.card = false;
    this.name = 'resident-list';
  }

  ngOnInit(): void {
  }
}
