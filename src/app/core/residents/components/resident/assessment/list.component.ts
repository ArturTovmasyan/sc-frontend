import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAssessmentService} from '../../../services/resident-assessment.service';
import {ResidentAssessment} from '../../../models/resident-assessment';
import {ReportService} from '../../../services/report.service';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Button, ButtonMode} from '../../../../../shared/components/modal/button-bar.component';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAssessmentService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentAssessment, ResidentAssessmentService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: ResidentAssessmentService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService,
    private report$: ReportService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.modal$.without_save_and_add = true;

    this.name = 'resident-assessment-list';
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
  }

  ngAfterViewInit(): void {
    this.add_button_center(new Button(
      'blank',
      'grid.resident-assessment-list.button.blank',
      'default',
      ButtonMode.SINGLE_SELECT,
      null,
      'far fa-file',
      false,
      true,
      () => {
        this.loading = true;
        this.report$.report('assessment', 'blank', 'pdf',
          {assessment_id: this.checkbox_config.ids[0]}, () => {
            this.loading = false;
          }, (error) => {
            this.loading = false;
            this.message$.error(error.data.error, {nzDuration: 10000});
          });
      }));
    this.add_button_center(new Button(
      'filled',
      'grid.resident-assessment-list.button.filled',
      'default',
      ButtonMode.SINGLE_SELECT,
      null,
      'far fa-file',
      false,
      true,
      () => {
        this.loading = true;
        this.report$.report('assessment', 'filled', 'pdf',
          {assessment_id: this.checkbox_config.ids[0]}, () => {
            this.loading = false;
          }, (error) => {
            this.loading = false;
            this.message$.error(error.data.error, {nzDuration: 10000});
          });
      }));
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            if (this.params.filter(v => v.key === 'resident_id').length === 0) {
              this.params.push({key: 'resident_id', value: next.toString()});
              super.init();
            }
          }
        });
        break;
      default:
        break;
    }
  }

}
