import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {ResidentService} from '../../../services/resident.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from '../resident/form/form.component';
import {Resident} from '../../../models/resident';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-residents-list',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentService, ModalFormService]
})
export class ListComponent extends GridComponent<Resident, ResidentService> implements OnInit, OnDestroy {
  @Input('options') set options(options: { state?: string, type?: number, type_id?: number, compact?: boolean }) {
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

      if (options.compact) {
        this.add_param('compact', 'true');
      }

      super.init();

      this.grid_options_loaded.subscribe(next => {
        if (next) {
          if (options.compact) {
            this.component = null;
            this.update_sort({key: 'room', value: 'asc'});
          }
        }
      });
    }
  }

  constructor(
    protected service$: ResidentService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.card = false;
    this.name = 'resident-list';
  }

  ngOnInit(): void {
  }
}
