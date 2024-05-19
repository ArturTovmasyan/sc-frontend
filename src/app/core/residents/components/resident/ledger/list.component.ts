import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentLedgerService} from '../../../services/resident-ledger.service';
import {ResidentLedger} from '../../../models/resident-ledger';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
    templateUrl: '../../../../../shared/components/grid/grid.component.html',
    styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
    providers: [ResidentLedgerService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentLedger, ResidentLedgerService> implements OnInit {
    constructor(
        protected service$: ResidentLedgerService,
        protected title$: TitleService,
        protected modal$: ModalFormService,
        private residentSelector$: ResidentSelectorService
    ) {
        super(service$, title$, modal$);

        this.component = FormComponent;
        this.permission = 'persistence-resident-resident_ledger';
        this.name = 'resident-ledger-list';

        this.grid_options_loaded.subscribe(next => {
          if (next) {
            const btn = this._btnBar.buttons_crud.filter(v => v.name === 'add').pop();
            const btn_edit = this._btnBar.buttons_crud.filter(v => v.name === 'edit').pop();

            if (btn) {
              btn.show = false; // TODO: review
            }

            if (btn_edit) {
              btn_edit.show = false; // TODO: review
            }
          }
        });
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
