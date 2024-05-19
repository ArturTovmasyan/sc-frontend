import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivityService} from '../../services/activity.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {Activity} from '../../models/activity';
import {TitleService} from '../../../services/title.service';
import {FormComponent} from '../activity/form/form.component';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard-activity',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityService, ModalFormService]
})
export class ListComponent extends GridComponent<Activity, ActivityService> implements OnInit, AfterViewInit {
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

    this.grid_options_loaded.subscribe(next => {
      if (next) {
        const btn = this._btnBar.buttons_crud.filter(v => v.name === 'add').pop();

        if (btn) {
          btn.show = false; // TODO: review
        }
      }
    });
  }

  ngOnInit(): void {
    this.params.push({key: 'my', value: '1'});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      // form.get('owner_type').setValue(ActivityOwnerType.REFERRAL);
      // form.get('referral_id').setValue(this.referral_id);
    };
  }
}
