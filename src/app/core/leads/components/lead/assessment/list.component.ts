import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {LeadAssessmentService} from '../../../services/lead-assessment.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {LeadAssessment} from '../../../models/lead-assessment';
import {FormGroup} from '@angular/forms';
// import {Button, ButtonMode} from '../../../../../shared/components/modal/button-bar.component';

@Component({
  selector: 'app-lead-lead-assessment',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadAssessmentService, ModalFormService]
})
export class ListComponent extends GridComponent<LeadAssessment, LeadAssessmentService> implements OnInit, AfterViewInit {
  @Input() lead_id: number;

  constructor(
    protected service$: LeadAssessmentService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    // private report$: ReportService,
    // private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-resident-assessment-assessment';
    this.name = 'resident-assessment-list';
    this.modal$.without_save_and_add = true;
  }

  ngOnInit(): void {
    this.params.push({key: 'lead_id', value: this.lead_id.toString()});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('lead_id').setValue(this.lead_id);
    };

    // this.add_button_center(new Button(
    //   'blank',
    //   'grid.resident-assessment-list.button.blank',
    //   'default',
    //   ButtonMode.SINGLE_SELECT,
    //   null,
    //   'far fa-file',
    //   false,
    //   true,
    //   () => {
    //     this.loading = true;
    //     this.report$.report('assessment', 'blank', 'pdf',
    //       {assessment_id: this.checkbox_config.ids[0]}, () => {
    //         this.loading = false;
    //       }, (error) => {
    //         this.loading = false;
    //         this.message$.error(error.data.error, {nzDuration: 10000});
    //       });
    //   }));
    // this.add_button_center(new Button(
    //   'filled',
    //   'grid.resident-assessment-list.button.filled',
    //   'default',
    //   ButtonMode.SINGLE_SELECT,
    //   null,
    //   'far fa-file',
    //   false,
    //   true,
    //   () => {
    //     this.loading = true;
    //     this.report$.report('assessment', 'filled', 'pdf',
    //       {assessment_id: this.checkbox_config.ids[0]}, () => {
    //         this.loading = false;
    //       }, (error) => {
    //         this.loading = false;
    //         this.message$.error(error.data.error, {nzDuration: 10000});
    //       });
    //   }));
  }

}
