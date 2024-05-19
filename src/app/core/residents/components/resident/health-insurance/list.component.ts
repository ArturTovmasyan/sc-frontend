import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentHealthInsurance} from '../../../models/resident-health-insurance';
import {ResidentHealthInsuranceService} from '../../../services/resident-health-insurance.service';
import {ResidentSelectorService} from '../../../services/resident-selector.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentHealthInsuranceService]
})
export class ListComponent extends GridComponent<ResidentHealthInsurance, ResidentHealthInsuranceService> implements OnInit {
  constructor(
    protected service$: ResidentHealthInsuranceService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    private residentSelector$: ResidentSelectorService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-health-insurance-list';
  }

  ngOnInit(): void {
    this.buttons_center.push(
      {
        name: 'download_first',
        type: 'default',
        multiselect: false,
        free: false,
        nzIcon: null,
        faIcon: 'far fa-file',
        click: (ids: number[]) => {
          this.loading = true;
          this.service$.download(ids[0], 1, () => {
            this.loading = false;
          }, (error) => {
            this.loading = false;
            this.message$.error(error.data.error, {nzDuration: 10000});
          });
        }
      },
      {
        name: 'download_second',
        type: 'default',
        multiselect: false,
        free: false,
        nzIcon: null,
        faIcon: 'far fa-file',
        click: (ids: number[]) => {
          this.loading = true;
          this.service$.download(ids[0], 2, () => {
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
