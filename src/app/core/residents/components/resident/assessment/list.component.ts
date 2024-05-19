import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAssessmentService} from '../../../services/resident-assessment.service';
import {ResidentAssessment} from '../../../models/resident-assessment';
import {ReportService} from '../../../services/report.service';
import {ResidentSelectorService} from '../../../services/resident-selector.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAssessmentService]
})
export class ListComponent extends GridComponent<ResidentAssessment, ResidentAssessmentService> implements OnInit {
  constructor(
    protected service$: ResidentAssessmentService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    private residentSelector$: ResidentSelectorService,
    private report$: ReportService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.without_save_and_add = true;

    this.name = 'resident-assessment-list';
  }

  ngOnInit(): void {
    this.buttons_center.push(
      {
        name: 'blank',
        type: 'default',
        multiselect: false,
        free: false,
        nzIcon: null,
        faIcon: 'far fa-file',
        click: (ids: number[]) => {
          this.loading = true;
          this.report$.report('assessment', 'blank', 'pdf', {assessment_id: ids[0]}, () => {
            this.loading = false;
          }, (error) => {
            this.loading = false;
            this.message$.error(error.data.error, {nzDuration: 10000});
          });
        }
      }
    );

    this.buttons_center.push(
      {
        name: 'filled',
        type: 'default',
        multiselect: false,
        free: false,
        nzIcon: null,
        faIcon: 'far fa-file-alt',
        click: (ids: number[]) => {
          this.loading = true;
          this.report$.report('assessment', 'filled', 'pdf', {assessment_id: ids[0]}, () => {
            this.loading = false;
          }, (error) => {
            this.loading = false;
            this.message$.error(error.data.error, {nzDuration: 10000});
          });
        }
      }
    );

    this.subscribe('rs_resident');
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
