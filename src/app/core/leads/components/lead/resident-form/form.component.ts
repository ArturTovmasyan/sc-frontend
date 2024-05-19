import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {first} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {FormComponent as SalutationFormComponent} from '../../../../residents/components/salutation/form/form.component';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Gender} from '../../../../residents/models/gender.enum';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Salutation} from '../../../../residents/models/salutation';
import {SalutationService} from '../../../../residents/services/salutation.service';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {CoreValidator} from '../../../../../shared/utils/core-validator';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    salutations: Salutation[];

    genders: { id: Gender, name: string }[];

    disabledDate: (date: Date) => boolean;

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private salutation$: SalutationService
    ) {
        super(modal$);
        this.modal_map = [
            {key: 'salutation', component: SalutationFormComponent}
        ];

        this.disabledDate = (current: Date): boolean => {
            const today = DateHelper.newDate();
            return differenceInCalendarDays(current, today) > 0;
        };
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],
            first_name: [{value: '', disabled: true}, Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            last_name: [{value: '', disabled: true}, Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            birthday: [DateHelper.newDate(), Validators.required],
            gender: [null, Validators.required],

            salutation_id: [null, Validators.required],
        });

        this.subscribe('list_salutation');

        // TODO: review
        this.genders = [
            {id: Gender.MALE, name: 'Male'},
            {id: Gender.FEMALE, name: 'Female'},
        ];
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'list_salutation':
                this.$subscriptions[key] = this.salutation$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.salutations = res;

                        if (params) {
                            this.form.get('salutation_id').setValue(params.salutation_id);
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    after_set_form_data(): void {
        super.after_set_form_data();
    }

    formValue(): void {
        const value = super.formValue();
        value.birthday = DateHelper.makeUTCDateOnly(value.birthday);
        return value;
    }
}
