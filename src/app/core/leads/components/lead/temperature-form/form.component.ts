import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd';
import {Lead} from '../../../models/lead';
import {LeadService} from '../../../services/lead.service';
import {FormComponent as TemperatureFormComponent} from '../../temperature/form/form.component';
import {Temperature} from '../../../models/temperature';
import {TemperatureService} from '../../../services/temperature.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  leads: Lead[];

  temperatures: Temperature[];

  private _show_lead: boolean = true;

  get show_lead(): boolean {
    return this._show_lead;
  }

  set show_lead(value: boolean) {
    this._show_lead = value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private modal$: NzModalService,
    private lead$: LeadService,
    private temperature$: TemperatureService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      lead_id: [null, Validators.compose([Validators.required])],
      temperature_id: [null, Validators.compose([Validators.required])],

      date: [new Date(), Validators.compose([Validators.required])],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

    });

    this.subscribe('list_lead');
    this.subscribe('list_temperature');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_lead':
        this.$subscriptions[key] = this.lead$.all([{key: 'free', value: '1'}]).pipe(first()).subscribe(res => {
          if (res) {
            this.leads = res;

            // if (this.edit_mode && this.edit_data.lead !== null) {
            //   const leads = this.leads.filter(v => v.id === this.edit_data.lead.id);
            //
            //   if (leads.length === 0) {
            //     this.leads.push(this.edit_data.lead);
            //   }
            // }

            if (params) {
              this.form.get('lead_id').setValue(params.lead_id);
            }
          }
        });
        break;
      case 'list_temperature':
        this.$subscriptions[key] = this.temperature$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.temperatures = res;

            if (params) {
              this.form.get('temperature_id').setValue(params.temperature_id);
            }
          }
        });
        break;
      default:
        break;
    }
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (data !== null) {
      // this.edit_data = _.cloneDeep(data);
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'temperature':
        this.create_modal(
          this.modal$,
          TemperatureFormComponent,
          data => this.temperature$.add(data),
          data => {
            this.subscribe('list_temperature', {temperature_id: data[0]});
            return null;
          });
        break;
    }
  }
}
