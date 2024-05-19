import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentDiagnoseService} from '../../../../services/resident-diagnose.service';
import {ResidentDiagnose} from '../../../../models/resident-diagnose';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-resident-history-diagnose',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentDiagnoseService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentDiagnose, ResidentDiagnoseService> implements OnInit {
  constructor(
    protected service$: ResidentDiagnoseService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-diagnoses-list';
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
