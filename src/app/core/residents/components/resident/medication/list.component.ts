import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentMedicationService} from '../../../services/resident-medication.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentMedication} from '../../../models/resident-medication';
import {ResidentSelectorService} from '../../../services/resident-selector.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentMedicationService]
})
export class ListComponent extends GridComponent<ResidentMedication, ResidentMedicationService> implements OnInit {
  constructor(
    protected service$: ResidentMedicationService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-medication-list';
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');

    this.buttons_center.push(this.get_show_hide_button());
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

  get_show_hide_button() {
    let label = '';
    let value = '';

    const param = this.params.filter(v => v.key === 'discontinued').pop();

    if (param) {
      value = param.value === '1' ? '0' : '1';
    } else {
      value = '1';
    }

    if (value === '1') {
      label = 'unhide';
    } else {
      label = 'hide';
    }

    return {
      name: label,
      type: 'default',
      multiselect: false,
      free: true,
      nzIcon: null,
      faIcon: 'fas fa-medkit',
      click: (ids: number[]) => {
        this.loading = true;
        this.params = this.params.filter(v => v.key !== 'discontinued');
        this.params.push({key: 'discontinued', value: value});
        super.init(true);

        this.buttons_center = [];
        this.buttons_center.push(this.get_show_hide_button());
      }
    };
  }
}
