import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {FormGroup} from '@angular/forms';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../services/title.service';
import {FormComponent} from '../activity/form/form.component';
import {ChangeLogService} from '../../../admin/services/change-log.service';
import {ChangeLog} from '../../../models/change-log';

@Component({
  selector: 'app-dashboard-change-log',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ChangeLogService]
})
export class ListComponent extends GridComponent<ChangeLog, ChangeLogService> implements OnInit {
  constructor(
    protected service$: ChangeLogService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'lead-change-log-list';

    this.grid_options_loaded.subscribe(next => {
      if (next) {
        this.button_shows.add = false;
        this.button_shows.edit = false;
        this.button_shows.remove = true;
      }
    });
  }

  ngOnInit(): void {
    this.params.push({key: 'my', value: '1'});

    super.init();
  }

  protected preset_modal_form_data(form: FormGroup) {
    // form.get('owner_type').setValue(ChangeLogOwnerType.REFERRAL);
    // form.get('referral_id').setValue(this.referral_id);
  }
}
