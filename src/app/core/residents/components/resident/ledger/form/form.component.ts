import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {CurrencyPipe} from '@angular/common';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private residentSelector$: ResidentSelectorService
    ) {
        super(modal$);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            amount: [0, Validators.compose([Validators.required, CoreValidator.payment_amount])],

            balance_due: [0, Validators.compose([Validators.required, CoreValidator.payment_amount])],

            resident_id: [null, Validators.required]
        });

        this.subscribe('rs_resident');
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'rs_resident':
                this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
                    if (next) {
                        this.form.get('resident_id').setValue(next);
                    }
                });
                break;
            default:
                break;
        }
    }
}
