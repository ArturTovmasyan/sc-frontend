import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as _ from 'lodash';
import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {PhoneType} from '../../../../models/phone-type.enum';
import {ReferrerType} from '../../../models/referrer-type';
import {ReferrerTypeService} from '../../../services/referrer-type.service';
import {Organization} from '../../../models/organization';
import {OrganizationService} from '../../../services/organization.service';
import {CityStateZip} from '../../../../residents/models/city-state-zip';
import {CareType} from '../../../models/care-type';
import {CareLevel} from '../../../../residents/models/care-level';
import {CurrentResidence} from '../../../models/current-residence';
import {Hobby} from '../../../models/hobby';
import {User} from '../../../../models/user';
import {Facility} from '../../../../residents/models/facility';
import {CityStateZipService} from '../../../../residents/services/city-state-zip.service';
import {CareTypeService} from '../../../services/care-type.service';
import {CareLevelService} from '../../../../residents/services/care-level.service';
import {CurrentResidenceService} from '../../../services/current-residence.service';
import {HobbyService} from '../../../services/hobby.service';
import {FacilityService} from '../../../../residents/services/facility.service';
import {UserService} from '../../../../admin/services/user.service';
import {PaymentSource} from '../../../../residents/models/payment-source';
import {PaymentSourceService} from '../../../../residents/services/payment-source.service';
import {Lead, LeadState} from '../../../models/lead';
import {Contact} from '../../../models/contact';
import {ContactService} from '../../../services/contact.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as CareTypeFormComponent} from '../../care-type/form/form.component';
import {FormComponent as CareLevelFormComponent} from '../../../../residents/components/care-level/form/form.component';
import {FormComponent as CurrentResidenceFormComponent} from '../../current-residence/form/form.component';
import {FormComponent as HobbyFormComponent} from '../../hobby/form/form.component';
import {FormComponent as PaymentSourceFormComponent} from '../../../../residents/components/payment-source/form/form.component';
import {FormComponent as CityStateZipFormComponent} from '../../../../residents/components/city-state-zip/form/form.component';
import {FormComponent as ReferrerTypeFormComponent} from '../../referrer-type/form/form.component';
import {FormComponent as OrganizationFormComponent} from '../../organization/form/form.component';
import {FormComponent as LeadContactFormComponent} from '../../contact/form/form.component';
import {FormComponent as FunnelStageFormComponent} from '../../funnel-stage/form/form.component';
import {FormComponent as TemperatureFormComponent} from '../../temperature/form/form.component';
import {FunnelStage} from '../../../models/funnel-stage';
import {Temperature} from '../../../models/temperature';
import {FunnelStageService} from '../../../services/funnel-stage.service';
import {TemperatureService} from '../../../services/temperature.service';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {QualificationRequirement} from '../../../models/qualification-requirement';
import {QualificationRequirementService} from '../../../services/qualification-requirement.service';
import {Qualified} from '../../../models/qualified.enum';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    qualifieds: { id: Qualified, name: string }[];

    city_state_zips: CityStateZip[];
    payment_sources: PaymentSource[];
    funnel_stages: FunnelStage[];
    temperatures: Temperature[];
    users: User[];

    care_types: CareType[];
    care_levels: CareLevel[];

    referrer_types: ReferrerType[];

    current_residences: CurrentResidence[];

    facilities: Facility[];
    facilities_all: Facility[];
    hobbies: Hobby[];

    organizations: Organization[];
    contacts: Contact[];

    phone_types: { id: PhoneType, name: string }[];

    contact: Contact;

    qualification_requirements: QualificationRequirement[];

    edit_data: Lead;

    disabledDate: (date: Date) => boolean;

    constructor(protected modal$: ModalFormService,
                private formBuilder: FormBuilder,
                private _el: ElementRef,
                private csz$: CityStateZipService,
                private payment_source$: PaymentSourceService,
                private user$: UserService,
                private facility$: FacilityService,
                private hobby$: HobbyService,
                private care_type$: CareTypeService,
                private care_level$: CareLevelService,
                private current_residence$: CurrentResidenceService,
                private organization$: OrganizationService,
                private contact$: ContactService,
                private referrer_type$: ReferrerTypeService,
                private funnel_stage$: FunnelStageService,
                private temperature$: TemperatureService,
                private qualification_requirement$: QualificationRequirementService) {
        super(modal$);
        this.modal_map = [
            {key: 'care_type', component: CareTypeFormComponent},
            {key: 'care_level', component: CareLevelFormComponent},
            {key: 'current_residence', component: CurrentResidenceFormComponent},
            {key: 'hobby', component: HobbyFormComponent},
            {key: 'payment_source', component: PaymentSourceFormComponent},
            {key: 'csz', component: CityStateZipFormComponent},
            {key: 'referrer_type', component: ReferrerTypeFormComponent},
            {key: 'organization', component: OrganizationFormComponent},
            {key: 'contact', component: LeadContactFormComponent},
            {key: 'funnel_stage', component: FunnelStageFormComponent},
            {key: 'temperature', component: TemperatureFormComponent}
        ];

        this.disabledDate = (current: Date): boolean => {
            const today = DateHelper.newDate();
            return differenceInCalendarDays(current, today) > 0;
        };
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            care_type_id: [null, Validators.compose([])],
            care_level_id: [null, Validators.compose([])],
            payment_type_id: [null, Validators.compose([])],
            owner_id: [null, Validators.compose([Validators.required])],

            initial_contact_date: [DateHelper.newDate(), Validators.compose([Validators.required])],

            state: [LeadState.OPEN, Validators.compose([])],

            birthday: [null],
            spouse_name: ['', Validators.compose([Validators.maxLength(120)])],
            current_residence_id: [null, Validators.compose([])],

            responsible_person_first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            responsible_person_last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            responsible_person_address_1: ['', Validators.compose([Validators.maxLength(100)])],
            responsible_person_address_2: ['', Validators.compose([Validators.maxLength(100)])],
            responsible_person_csz_id: [null, Validators.compose([])],
            responsible_person_email: ['', Validators.compose([Validators.email])],
            responsible_person_phone: ['', Validators.compose([CoreValidator.phone])],

            referral: this.formBuilder.group({
                id: [''],
                type_id: [null, Validators.compose([Validators.required])],
                organization_id: [null, Validators.compose([Validators.required])],
                contact_id: [null, Validators.compose([Validators.required])],
                notes: ['', Validators.compose([Validators.maxLength(512)])],
            }),

            primary_facility_id: [null, Validators.compose([])],
            facilities: [[], Validators.compose([])],
            hobbies: [[], Validators.compose([])],
            notes: ['', Validators.compose([Validators.maxLength(2048)])],

            funnel_stage_id: [null, Validators.compose([Validators.required])],
            temperature_id: [null, Validators.compose([Validators.required])],

            phones: this.formBuilder.array([]),

            qualifications: this.formBuilder.array([]),
            close_lead: [false, Validators.required],
        });

        this.qualifieds = [
            {id: Qualified.YES, name: 'Yes'},
            {id: Qualified.NOT_SURE, name: '??'},
            {id: Qualified.NO, name: 'No'}
        ];

        this.postSubmit = (data: any) => {
            const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
            if (invalid_el) {
                const tab_el = invalid_el.closest('.ant-tabs-tabpane');
                this.tabSelected.next([].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el));
            }
        };

        this.form.get('referral.organization_id').disable();
        this.form.get('referral.contact_id').disable();
        this.form.get('referral.notes').disable();
        this.form.get('close_lead').disable();

        this.phone_types = [
            {id: PhoneType.HOME, name: 'HOME'},
            {id: PhoneType.MOBILE, name: 'MOBILE'},
            {id: PhoneType.WORK, name: 'WORK'},
            {id: PhoneType.OFFICE, name: 'OFFICE'},
            {id: PhoneType.EMERGENCY, name: 'EMERGENCY'},
            {id: PhoneType.FAX, name: 'FAX'},
            {id: PhoneType.ROOM, name: 'ROOM'}
        ];

        this.subscribe('list_csz');
        this.subscribe('list_payment_source');
        this.subscribe('list_user');
        this.subscribe('list_facility');
        this.subscribe('list_facility_all');
        this.subscribe('list_hobby');
        this.subscribe('list_care_type');
        this.subscribe('list_care_level');
        this.subscribe('list_current_residence');

        this.subscribe('list_organization');
        this.subscribe('list_referrer_type');

        this.subscribe('list_qualification_requirement');
    }

    protected refElement(): ElementRef<any> {
        return this._el;
    }

    public get_form_array_skeleton(key: string): FormGroup {
        switch (key) {
            case 'referral.phones':
                return this.formBuilder.group({
                    id: [null],
                    type: [null, Validators.required],
                    number: ['', Validators.compose([Validators.required, CoreValidator.phone])],
                    primary: [false],
                    compatibility: [null]
                });
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
            case 'list_funnel_stage':
                this.$subscriptions[key] = this.funnel_stage$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.funnel_stages = res;

                        if (params) {
                            this.form.get('funnel_stage_id').setValue(params.funnel_stage_id);
                        } else {
                            if (!this.edit_mode) {
                                this.form.get('funnel_stage_id').setValue(this.funnel_stages[0].id);
                            }
                        }
                    }
                });
                break;
            case 'list_temperature':
                this.$subscriptions[key] = this.temperature$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.temperatures = res;

                        if (params) {
                            this.form.get('temperature_id').setValue(params.temperature_id);
                        } else {
                            if (!this.edit_mode) {
                                this.form.get('temperature_id').setValue(this.temperatures[0].id);
                            }
                        }
                    }
                });
                break;
            case 'list_csz':
                this.$subscriptions[key] = this.csz$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.city_state_zips = res;

                        if (params) {
                            this.form.get('responsible_person_csz_id').setValue(params.csz_id);
                        }
                    }
                });
                break;
            case 'list_payment_source':
                this.$subscriptions[key] = this.payment_source$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.payment_sources = res;

                        if (params) {
                            this.form.get('payment_type_id').setValue(params.payment_source_id);
                        }
                    }
                });
                break;
            case 'list_facility':
                this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.facilities = res;
                    }
                });
                break;
            case 'list_facility_all':
                this.$subscriptions[key] = this.facility$.all([{
                    key: 'all',
                    value: '1'
                }]).pipe(first()).subscribe(res => {
                    if (res) {
                        this.facilities_all = res;
                    }
                });
                break;
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
            case 'list_user':
                this.$subscriptions[key] = this.user$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.users = res;

                        if (params) {
                            this.form.get('owner_id').setValue(params.owner_id);
                        }
                    }
                });
                break;
            case 'list_care_type':
                this.$subscriptions[key] = this.care_type$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.care_types = res;

                        if (params) {
                            this.form.get('care_type_id').setValue(params.care_type_id);
                        }
                    }
                });
                break;
            case 'list_care_level':
                this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.care_levels = res;

                        if (params) {
                            this.form.get('care_level_id').setValue(params.care_level_id);
                        }
                    }
                });
                break;
            case 'list_current_residence':
                this.$subscriptions[key] = this.current_residence$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.current_residences = res;

                        if (params) {
                            this.form.get('current_residence_id').setValue(params.current_residence_id);
                        }
                    }
                });
                break;
            case 'list_referrer_type':
                this.unsubscribe('vc_referrer_type');
                this.$subscriptions[key] = this.referrer_type$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.referrer_types = res;

                        if (params) {
                            this.form.get('referral.type_id').setValue(params.referrer_type_id);
                        }

                        this.subscribe('vc_referrer_type');
                        this.form.get('referral.type_id').setValue(this.form.get('referral.type_id').value);
                    }
                });
                break;
            case 'list_organization':
                this.$subscriptions[key] = this.organization$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.organizations = res;

                        if (params) {
                            this.form.get('referral.organization_id').setValue(params.organization_id);
                        }

                        this.subscribe('vc_organization');
                        this.form.get('referral.organization_id').setValue(this.form.get('referral.organization_id').value);
                    }
                });
                break;
            case 'list_contact':
                this.$subscriptions[key] = this.contact$
                    .all(params && params.organization_id ? [{
                        key: 'organization_id',
                        value: params.organization_id
                    }] : [])
                    .pipe(first()).subscribe(res => {
                        if (res) {
                            this.contacts = res;

                            this.subscribe('vc_contact');

                            if (params && params.contact_id) {
                                this.form.get('referral.contact_id').setValue(params.contact_id);
                            } else {
                                this.form.get('referral.contact_id').setValue(this.form.get('referral.contact_id').value);
                            }
                        }
                    });
                break;
            case 'vc_organization':
                this.$subscriptions[key] = this.form.get('referral.organization_id').valueChanges.subscribe(next => {
                    if (next) {
                        this.subscribe('list_contact', {organization_id: next});
                    }
                });
                break;
            case 'vc_contact':
                this.$subscriptions[key] = this.form.get('referral.contact_id').valueChanges.subscribe(next => {
                    this.contact = this.contacts.filter(v => v.id === this.form.get('referral.contact_id').value).pop();
                });
                break;
            case 'vc_referrer_type':
                this.$subscriptions[key] = this.form.get('referral.type_id').valueChanges.subscribe(next => {
                    if (next) {
                        const type = this.referrer_types.filter(v => v.id === next).pop();

                        if (type) {
                            this.contacts = [];

                            if (this.edit_mode) {
                                if (this.edit_data.referral !== null && this.edit_data.referral.type !== null && this.edit_data.referral.type.id !== next) {
                                    this.form.get('referral.organization_id').setValue(null);
                                    this.form.get('referral.contact_id').setValue(null);
                                    this.edit_data.referral.type.id = null;
                                }
                            } else {
                                this.form.get('referral.organization_id').setValue(null);
                                this.form.get('referral.contact_id').setValue(null);
                            }

                            if (type.organization_required) {
                                this.form.get('referral.organization_id').enable();
                            } else {
                                this.form.get('referral.organization_id').disable();

                                this.subscribe('list_contact');
                            }

                            if (type.representative_required) {
                                this.form.get('referral.contact_id').enable();
                                this.form.get('referral.notes').enable();
                            } else {
                                this.form.get('referral.contact_id').disable();
                                this.form.get('referral.notes').disable();
                            }
                        } else {
                            this.form.get('referral.organization_id').disable();

                            this.form.get('referral.contact_id').disable();
                            this.form.get('referral.notes').disable();
                        }
                    }
                });
                break;
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

                                if (remaining_ids.length > 0) {
                                    const qualification_requirements = this.qualification_requirements.filter(val => remaining_ids.includes(val.id));

                                    qualification_requirements.forEach(value => {
                                        this.add_field('qualifications', {
                                            qualification_requirement_id: value.id,
                                            qualified: Qualified.NOT_SURE
                                        });
                                    });
                                }
                            }

                            this.get_form_array('qualifications').controls.forEach(control => {
                                control.valueChanges.subscribe(next => this.onQualificationValueChange(next));
                            });
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
            this.edit_data = _.cloneDeep(data);
        }

        if (this.edit_mode) {
            this.form.get('initial_contact_date').disable();
            this.form.get('funnel_stage_id').disable();
            this.form.get('temperature_id').disable();

            if (data.referral === null) {
                data.referral = {
                    id: '',
                    type_id: null,
                    organization_id: null,
                    contact_id: null,
                    notes: ''
                };
            }
        } else {
            this.form.get('initial_contact_date').enable();
            this.form.get('funnel_stage_id').enable();
            this.form.get('temperature_id').enable();

            this.subscribe('list_funnel_stage');
            this.subscribe('list_temperature');
        }
    }


    public after_set_form_data(): void {
        this.onQualificationValueChange(null);
    }

    formValue(): void {
        const value = super.formValue();
        if (value.birthday !== null) {
            value.birthday = DateHelper.makeUTCDateOnly(value.birthday);
        }
        return value;
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
