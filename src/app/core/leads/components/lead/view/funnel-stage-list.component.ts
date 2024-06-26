import {AfterViewInit, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../funnel-stage-form/form.component';
import {FormGroup} from '@angular/forms';
import {LeadFunnelStage} from '../../../models/lead-funnel-stage';
import {LeadFunnelStageService} from '../../../services/lead-funnel-stage.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-lead-lead-funnel-stage',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadFunnelStageService, ModalFormService]
})
export class ListComponent extends GridComponent<LeadFunnelStage, LeadFunnelStageService> implements OnInit, AfterViewInit {
  @Input() lead_id: number;
  @Input() set reloadIn(value: number) {
      this.reload_data();
  };
  @Output() reloadOut: EventEmitter<number> = new EventEmitter();

  constructor(
    protected service$: LeadFunnelStageService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-lead-lead_funnel_stage';
    this.name = 'lead-lead-funnel-stage-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'lead_id', value: this.lead_id.toString()});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('lead_id').setValue(this.lead_id);
    };
  }

  on_reload() {
    this.reloadOut.emit(Math.random());
  }
}
