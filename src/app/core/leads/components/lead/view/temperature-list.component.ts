import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../temperature-form/form.component';
import {FormGroup} from '@angular/forms';
import {LeadTemperature} from '../../../models/lead-temperature';
import {LeadTemperatureService} from '../../../services/lead-temperature.service';

@Component({
  selector: 'app-lead-lead-temperature',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadTemperatureService]
})
export class ListComponent extends GridComponent<LeadTemperature, LeadTemperatureService> implements OnInit {
  @Input() lead_id: Number;

  constructor(
    protected service$: LeadTemperatureService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'lead-lead-temperature-list';

    this.button_shows = {
      override: false,
      add: true,
      edit: false,
      remove: false,
    };

    this.button_labels = {
      add: 'Change',
      edit: '',
      remove: '',
    };

    this.button_icons = {
      add: 'edit',
      edit: '',
      remove: ''
    };

  }

  ngOnInit(): void {
    this.params.push({key: 'lead_id', value: this.lead_id.toString()});

    super.init();
  }

  protected preset_modal_form_data(form: FormGroup) {
    form.get('lead_id').setValue(this.lead_id);
  }
}
