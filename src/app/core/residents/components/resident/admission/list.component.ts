import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAdmission} from '../../../models/resident-admission';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {GroupType} from '../../../models/group-type.enum';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAdmissionService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentAdmission, ResidentAdmissionService> implements OnInit {
  first: boolean;

  constructor(
    protected service$: ResidentAdmissionService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.searchable = false;
    this.component = FormComponent;
    this.permission = 'persistence-resident-admission';
    this.name = 'resident-admission-list';

    this.first = true;
  }

  ngOnInit(): void {
    this.subscribe('rs_type');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_type':
        this.$subscriptions[key] = this.residentSelector$.type.subscribe(next => {
          if (this.first) {
            this.subscribe('rs_resident');
          } else {
            this.load_admissions();
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.load_admissions();
          }
        });
        break;
      default:
        break;
    }
  }

  load_admissions() {
    const resident = this.residentSelector$.resident ? this.residentSelector$.resident.value : null;
    const type = this.residentSelector$.type ? this.residentSelector$.type.value : null;

    if (resident !== null && type !== null) {
      const param_resident = this.params.filter(v => v.key === 'resident_id').pop();

      if (!param_resident) {
        this.params.push({key: 'resident_id', value: resident.toString()});
      } else {
        param_resident.value = resident.toString();
      }

      if (type === GroupType.APARTMENT) {
        this.params.push({key: 'apartment', value: '1'});
      }

      super.init();
    }
  }
}
