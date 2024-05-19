import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {

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
