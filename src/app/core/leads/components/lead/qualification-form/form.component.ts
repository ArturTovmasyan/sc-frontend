import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Qualified} from '../../../models/qualified.enum';
import {QualificationRequirement} from '../../../models/qualification-requirement';
import {QualificationRequirementService} from '../../../services/qualification-requirement.service';
import {Qualification} from '../../../models/qualification';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    qualifieds: { id: Qualified, name: string }[];

    qualification_requirements: QualificationRequirement[];

    edit_data: Qualification;

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private qualification_requirement$: QualificationRequirementService,
    ) {
        super(modal$);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            qualifications: this.formBuilder.array([]),
            close_lead: [false, Validators.required],
        });

        this.qualifieds = [
            {id: Qualified.YES, name: 'Yes'},
            {id: Qualified.NOT_SURE, name: '??'},
            {id: Qualified.NO, name: 'No'}
        ];

        this.subscribe('list_qualification_requirement');
    }

    public get_form_array_skeleton(key: string): FormGroup {
        switch (key) {
            case 'qualifications':
                return this.formBuilder.group({
                    qualification_requirement_id: [null, Validators.required],
                    qualified: ['', Validators.compose([Validators.required])],
                });
            default:
                return null;
        }
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'list_hobby':
            case 'list_qualification_requirement':
                this.$subscriptions[key] = this.qualification_requirement$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.qualification_requirements = res;

                        if (!this.edit_mode) {
                            this.qualification_requirements.forEach(value => {
                                this.add_field('qualifications', {
                                    qualification_requirement_id: value.id,
                                    qualified: Qualified.NOT_SURE
                                });
                            });
                        } else {
                            if (this.get_form_array('qualifications').length !== this.qualification_requirements.length) {
                                const edit_ids = this.get_form_array('qualifications').value.map(val => val.qualification_requirement_id);
                                const all_ids = this.qualification_requirements.map(val => val.id);
                                const remaining_ids = all_ids.filter(n => !edit_ids.includes(n));

                                this.get_form_array('qualifications').controls.forEach(control => {
                                    control.valueChanges.subscribe(next => this.onQualificationValueChange(next));
                                });

                                if (remaining_ids.length > 0) {
                                    const qualification_requirements = this.qualification_requirements.filter(val => remaining_ids.includes(val.id));

                                    qualification_requirements.forEach(value => {
                                        this.add_field('qualifications', {
                                            qualification_requirement_id: value.id,
                                            qualified: Qualified.NOT_SURE
                                        }, this.onQualificationValueChange);
                                    });
                                }


                            }
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

    public after_set_form_data(): void {
        this.onQualificationValueChange(null);
    }

    getFullQualifiedValue(): Qualified {
        const controls = this.get_form_array('qualifications').controls;

        const no = controls.some(control => control.get('qualified').value === Qualified.NO);
        const notSure = controls.some(control => control.get('qualified').value === Qualified.NOT_SURE);

        if (no) {
            return Qualified.NO;
        } else if (notSure) {
            return Qualified.NOT_SURE;
        } else {
            return Qualified.YES;
        }
    }

    getQualifiedButtonColor(i: number, qualified: Qualified): string {
        const value = this.get_form_array('qualifications').get(i.toString()).get('qualified').value;

        if (value !== qualified) {
            return 'rgb(255, 255, 255)';
        }

        switch (value) {
            case Qualified.NO:
                return '#fff2f0';
            case Qualified.NOT_SURE:
                return '#fffbe6';
            case Qualified.YES:
                return '#f6ffed';
            default:
                return 'rgb(255, 255, 255)';
        }
    }

    getQualifiedButtonBorderColor(i: number, qualified: Qualified): string {
        const value = this.get_form_array('qualifications').get(i.toString()).get('qualified').value;

        if (value !== qualified) {
            return 'rgb(217, 217, 217)';
        }

        switch (value) {
            case Qualified.NO:
                return '#ffccc7';
            case Qualified.NOT_SURE:
                return '#ffe58f';
            case Qualified.YES:
                return '#b7eb8f';
            default:
                return 'rgb(217, 217, 217)';
        }
    }

    getQualification(i: number): any {
        const value = this.get_form_array('qualifications').get(i.toString()).get('qualification_requirement_id').value;

        return this.qualification_requirements.filter(item => item.id === value).pop();
    }

    onQualificationValueChange(next: any): void {
        if (this.edit_mode) {
            if (this.getFullQualifiedValue() === Qualified.NO) {
                this.form.get('close_lead').enable();
            } else {
                this.form.get('close_lead').disable();
            }
        }
    }
}
