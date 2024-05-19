import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {ResidentMedicationService} from '../../../services/resident-medication.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentMedication} from '../../../models/resident-medication';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Button, ButtonMode} from '../../../../../shared/components/modal/button-bar.component';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentMedicationService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentMedication, ResidentMedicationService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: ResidentMedicationService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'resident-medication-list';
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');

  }

  ngAfterViewInit(): void {
    this.add_button_center(this.get_show_hide_button());
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
      label = 'grid.resident-medication-list.button.unhide';
    } else {
      label = 'grid.resident-medication-list.button.hide';
    }

    return new Button(
      'show_hide',
      label,
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'fas fa-medkit',
      false,
      true,
      () => {
        this.loading = true;
        this.params = this.params.filter(v => v.key !== 'discontinued');
        this.params.push({key: 'discontinued', value: value});
        super.init(true);

        this.clear_button_center();
        this.add_button_center(this.get_show_hide_button());
      });
  }
}
