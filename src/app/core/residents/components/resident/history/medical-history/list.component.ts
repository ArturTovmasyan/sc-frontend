import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentMedicalHistoryService} from '../../../../services/resident-medical-history.service';
import {ResidentMedicalHistory} from '../../../../models/resident-medical-history';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';

@Component({
  selector: 'app-resident-history-medical-history',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentMedicalHistoryService]
})
export class ListComponent extends GridComponent<ResidentMedicalHistory, ResidentMedicalHistoryService> implements OnInit {
  constructor(
    protected service$: ResidentMedicalHistoryService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-medical-history-list';
  }

  ngOnInit(): void {
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
