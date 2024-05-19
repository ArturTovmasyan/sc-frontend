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

              if (this.residentSelector$.type.value === GroupType.APARTMENT) {
                this.params.push({key: 'apartment', value: '1'});
              }

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
