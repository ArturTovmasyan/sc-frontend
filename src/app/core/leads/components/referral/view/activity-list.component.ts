import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {ActivityService} from '../../../services/activity.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {Activity, ActivityOwnerType} from '../../../models/activity';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../../activity/form/form.component';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-lead-referral-activity',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityService]
})
export class ListComponent extends GridComponent<Activity, ActivityService> implements OnInit {
  @Input() referral_id: Number;

  constructor(
    protected service$: ActivityService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'lead-activity-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'owner_type', value: ActivityOwnerType.REFERRAL.toString()});
    this.params.push({key: 'owner_id', value: this.referral_id.toString()});

    super.init();
  }

  protected preset_modal_form_data(form: FormGroup) {
    form.get('owner_type').setValue(ActivityOwnerType.REFERRAL);
    form.get('organization_id').setValue(this.referral_id);
  }
}
