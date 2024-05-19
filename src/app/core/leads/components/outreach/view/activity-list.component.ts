import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {Activity, ActivityOwnerType} from '../../../models/activity';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../../activity/form/form.component';
import {FormGroup} from '@angular/forms';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-lead-outreach-activity',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityService, ModalFormService]
})
export class ListComponent extends GridComponent<Activity, ActivityService> implements OnInit, AfterViewInit {
  @Input() outreach_id: number;

  constructor(
    protected service$: ActivityService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-lead-activity';
    this.name = 'lead-activity-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'owner_type', value: ActivityOwnerType.OUTREACH.toString()});
    this.params.push({key: 'owner_id', value: this.outreach_id.toString()});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('owner_type').setValue(ActivityOwnerType.OUTREACH);
      form.get('outreach_id').setValue(this.outreach_id);
    };
  }

}
