import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {FormGroup} from '@angular/forms';
import {ActivityService} from '../../services/activity.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {Activity} from '../../models/activity';
import {TitleService} from '../../../services/title.service';
import {FormComponent} from '../activity/form/form.component';

@Component({
  selector: 'app-dashboard-activity',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityService]
})
export class ListComponent extends GridComponent<Activity, ActivityService> implements OnInit {
  constructor(
    protected service$: ActivityService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'lead-activity-list';

    this.grid_options_loaded.subscribe(next => {
      if (next) {
        this.button_shows.add = false;
      }
    });
  }

  ngOnInit(): void {
    this.params.push({key: 'my', value: '1'});

    super.init();
  }

  protected preset_modal_form_data(form: FormGroup) {
    // form.get('owner_type').setValue(ActivityOwnerType.REFERRAL);
    // form.get('referral_id').setValue(this.referral_id);
  }
}
