import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {Hobby} from '../../../models/hobby';
import {HobbyService} from '../../../services/hobby.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as HobbyFormComponent} from '../../hobby/form/form.component';
import {Interest} from '../../../models/interest';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    hobbies: Hobby[];

    edit_data: Interest;

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private hobby$: HobbyService,
    ) {
        super(modal$);
        this.modal_map = [
            {key: 'hobby', component: HobbyFormComponent},
        ];
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            hobbies: [[], Validators.compose([])],
            notes: ['', Validators.compose([Validators.maxLength(2048)])],
        });

        this.subscribe('list_hobby');
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'list_hobby':
                this.$subscriptions[key] = this.hobby$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.hobbies = res;

                        if (params) {
                            const hobbies = _.isArray(this.form.get('hobbies').value) ? this.form.get('hobbies').value : [];
                            hobbies.push(params.hobby_id);

                            this.form.get('hobbies').setValue(hobbies);
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    before_set_form_data(data: any, previous_data?: any): void {
        super.before_set_form_data(data, previous_data);

        if (data !== null) {
            // this.edit_data = _.cloneDeep(data);
        }
    }
}
