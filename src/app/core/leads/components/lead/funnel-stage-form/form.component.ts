import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd';
import {Lead} from '../../../models/lead';
import {LeadService} from '../../../services/lead.service';
import {FunnelStage} from '../../../models/funnel-stage';
import {StageChangeReason} from '../../../models/stage-change-reason';
import {FunnelStageService} from '../../../services/funnel-stage.service';
import {StageChangeReasonService} from '../../../services/stage-change-reason.service';
import {FormComponent as StageChangeReasonFormComponent} from '../../stage-change-reason/form/form.component';
import {FormComponent as FunnelStageFormComponent} from '../../funnel-stage/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  leads: Lead[];

  stages: FunnelStage[];
  reasons: StageChangeReason[];

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
    private funnel_stage$: FunnelStageService,
    private stage_change_reason$: StageChangeReasonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      lead_id: [null, Validators.compose([Validators.required])],
      stage_id: [null, Validators.compose([Validators.required])],
      reason_id: [null, Validators.compose([Validators.required])],

      date: [new Date(), Validators.compose([Validators.required])],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

    });

    this.subscribe('list_lead');
    this.subscribe('list_funnel_stage');
    this.subscribe('list_stage_change_reason');
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
      case 'list_stage_change_reason':
        this.$subscriptions[key] = this.stage_change_reason$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.reasons = res;

            if (params) {
              this.form.get('reason_id').setValue(params.reason_id);
            }
          }
        });
        break;
      case 'list_funnel_stage':
        this.$subscriptions[key] = this.funnel_stage$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.stages = res;

            if (params) {
              this.form.get('stage_id').setValue(params.stage_id);
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
      case 'stage_change_reason':
        this.create_modal(
          this.modal$,
          StageChangeReasonFormComponent,
          data => this.stage_change_reason$.add(data),
          data => {
            this.subscribe('list_stage_change_reason', {reason_id: data[0]});
            return null;
          });
        break;
      case 'funnel_stage':
        this.create_modal(
          this.modal$,
          FunnelStageFormComponent,
          data => this.funnel_stage$.add(data),
          data => {
            this.subscribe('list_funnel_stage', {stage_id: data[0]});
            return null;
          });
        break;
    }
  }
}
