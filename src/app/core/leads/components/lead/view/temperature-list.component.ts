import {AfterViewInit, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../temperature-form/form.component';
import {FormGroup} from '@angular/forms';
import {LeadTemperature} from '../../../models/lead-temperature';
import {LeadTemperatureService} from '../../../services/lead-temperature.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-lead-lead-temperature',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadTemperatureService, ModalFormService]
})
export class ListComponent extends GridComponent<LeadTemperature, LeadTemperatureService> implements OnInit, AfterViewInit {
  @Input() lead_id: number;
  @Output() reload: EventEmitter<number> = new EventEmitter();

  constructor(
    protected service$: LeadTemperatureService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-lead-lead_temperature';
    this.name = 'lead-lead-temperature-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'lead_id', value: this.lead_id.toString()});

    super.init();
  }

  ngAfterViewInit(): void {
    const add_btn = this._btnBar.buttons_crud.filter(v => v.name === 'add').pop();
    const remove_btn = this._btnBar.buttons_crud.filter(v => v.name === 'remove').pop();

    if (add_btn) {
      add_btn.title = 'Change'; // TODO: review
    }

    if (remove_btn) {
      remove_btn.show = false; // TODO: review
    }

    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('lead_id').setValue(this.lead_id);
    };
  }

  on_reload() {
    this.reload.emit(Math.random());
  }
}
