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
    constructor(protected service$: ResidentMedicationService,
                protected title$: TitleService,
                protected modal$: ModalFormService,
                private residentSelector$: ResidentSelectorService) {
        super(service$, title$, modal$);

        this.component = FormComponent;
        this.permission = 'persistence-resident-resident_medication';
        this.name = 'resident-medication-list';
    }

    ngOnInit(): void {
        this.subscribe('rs_resident');
        super.init();
    }

    ngAfterViewInit(): void {
        this.add_button_center(new Button(
            'active',
            'grid.resident-medication-list.button.active',
            'default',
            ButtonMode.FREE_SELECT,
            null,
            'fas fa-medkit',
            false,
            true,
            () => {
                const btn = this._btnBar.buttons_center[0];

                this.params = [];
                if (btn.name === 'active') {
                    this.params.push({key: 'active', value: '1'});
                }

                this.subscribe('rs_resident');
                this.reload_data(true);
            }));

        this.add_button_center(new Button(
            'discontinued',
            'grid.resident-medication-list.button.discontinued',
            'default',
            ButtonMode.FREE_SELECT,
            null,
            'fas fa-medkit',
            false,
            true,
            () => {
                const btn = this._btnBar.buttons_center[1];

                this.params = [];
                if (btn.name === 'discontinued') {
                    this.params.push({key: 'discontinued', value: '1'});
                }

                this.subscribe('rs_resident');
                this.reload_data(true);
            }));

        this.add_button_center(new Button(
            'both',
            'grid.resident-medication-list.button.both',
            'default',
            ButtonMode.FREE_SELECT,
            null,
            'fas fa-medkit',
            false,
            true,
            () => {
                const btn = this._btnBar.buttons_center[2];

                this.params = [];
                if (btn.name === 'both') {
                    this.params.push({key: 'both', value: '1'});
                }

                this.subscribe('rs_resident');
                this.reload_data(true);
            }));

    }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            if (this.params.filter(v => v.key === 'resident_id').length === 0) {
              this.params.push({key: 'resident_id', value: next.toString()});
            }
          }
        });
        break;
      default:
        break;
    }
  }
}
