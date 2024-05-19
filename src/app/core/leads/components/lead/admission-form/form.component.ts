import * as _ from 'lodash';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {FormComponent as SalutationFormComponent} from '../../../../residents/components/salutation/form/form.component';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Gender} from '../../../../residents/models/gender.enum';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Salutation} from '../../../../residents/models/salutation';
import {SalutationService} from '../../../../residents/services/salutation.service';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {GroupType} from '../../../../residents/models/group-type.enum';
import {CareLevel} from '../../../../residents/models/care-level';
import {FacilityDiningRoom} from '../../../../residents/models/facility-dining-room';
import {FacilityRoom} from '../../../../residents/models/facility-room';
import {AdmissionType, Admission} from '../../../models/admission';
import {FacilityService} from '../../../../residents/services/facility.service';
import {FacilityDiningRoomService} from '../../../../residents/services/facility-dining-room.service';
import {FacilityRoomService} from '../../../../residents/services/facility-room.service';
import {CareLevelService} from '../../../../residents/services/care-level.service';
import {GroupHelper} from '../../../../residents/helper/lead-admission-group-helper';
import {UserService} from '../../../../admin/services/user.service';
import {User} from '../../../../models/user';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    GROUP_TYPE = GroupType;

    public group_helper: GroupHelper;

    salutations: Salutation[];

    genders: { id: Gender, name: string }[];

    care_levels: CareLevel[];
    dining_rooms: FacilityDiningRoom[];
    facility_rooms: FacilityRoom[];
    users: User[];

    /** TODO: review **/
    group_id: any;
    edit_data: Admission;
    /** TODO: review **/

    admission_types: { id: AdmissionType, name: string }[];
    resident_state: string;

    disabledDate: (date: Date) => boolean;

    constructor(protected modal$: ModalFormService,
                private formBuilder: FormBuilder,
                private salutation$: SalutationService,
                private facility$: FacilityService,
                private dining_room$: FacilityDiningRoomService,
                private facility_room$: FacilityRoomService,
                private care_level$: CareLevelService,
                private user$: UserService,
                private _el: ElementRef) {
        super(modal$);

        this.group_helper = new GroupHelper();

        this.admission_types = [
            {id: AdmissionType.LONG_ADMIT, name: 'Long-Term Admit'},
            {id: AdmissionType.SHORT_ADMIT, name: 'Short-Term Admit'}
        ];

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
            first_name: [{
                value: '',
                disabled: true
            }, Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            last_name: [{
                value: '',
                disabled: true
            }, Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
            birthday: [DateHelper.newDate(), Validators.required],
            gender: [null, Validators.required],

            salutation_id: [null, Validators.required],

            admission_type: [null, Validators.required],

            date: [DateHelper.newDate(), Validators.required],

            group_type: [null, Validators.required],

            group: [null, Validators.required],

            dining_room_id: [null, [Validators.required]],
            facility_bed_id: [null, [Validators.required]],
            care_group: [null, [Validators.compose([Validators.required, CoreValidator.care_group])]],
            care_level_id: [null, [Validators.required]],

            user_id: [null, [Validators.required]]
        });

        this.form.get('group').disable();
        this.form.get('group_type').disable();
        this.init_subform(null);

        this.subscribe('list_salutation');
        this.subscribe('vc_admission_type');
        this.subscribe('vc_effective_date');
        this.subscribe('vc_group');

        // TODO: review
        this.genders = [
            {id: Gender.MALE, name: 'Male'},
            {id: Gender.FEMALE, name: 'Female'},
        ];

        this.postSubmit = (data: any) => {
            const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
            if (invalid_el) {
                const tab_el = invalid_el.closest('.ant-tabs-tabpane');
                this.tabSelected.next([].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el));
            }
        };
    }

    protected refElement(): ElementRef<any> {
        return this._el;
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'vc_admission_type':
                this.$subscriptions[key] = this.form.get('admission_type').valueChanges.subscribe(next => {
                    if (next) {
                        switch (next) {
                            case AdmissionType.LONG_ADMIT:
                            case AdmissionType.SHORT_ADMIT:
                                this.form.get('group').enable();
                                this.form.get('group_type').enable();

                                this.form.get('group_type').setValue(GroupType.FACILITY);

                                this.subscribe('list_facility');
                                break;
                        }
                    }

                    this.form.get('date').setValue(this.form.get('date').value);
                });
                break;
            case 'vc_effective_date':
                this.$subscriptions[key] = this.form.get('date').valueChanges.subscribe(next => {
                    if (next) {
                        const group = this.form.get('group').value;
                        if (group) {
                            switch (group.type) {
                                case GroupType.FACILITY:
                                    this.subscribe('list_facility_room', {
                                        'group_id': group.id,
                                        'vacant': 1,
                                        'date': next.toISOString()
                                    });
                                    break;
                            }
                        }
                    }
                });
                break;
            case 'list_facility':
                this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        res.forEach((v, i) => {
                            res[i]['type'] = GroupType.FACILITY;
                        });

                        this.group_helper.facilities = res;
                        if (this.form.get('group_type').value === GroupType.FACILITY && this.form.get('group').value === null) {
                            this.form.get('group').setValue(this.group_helper.get_group_data(this.group_id, this.form.get('group_type').value));
                        }
                    }
                });
                break;
            case 'vc_group':
                this.$subscriptions[key] = this.form.get('group').valueChanges.subscribe(next => {
                    if (next) {
                        this.form.get('group_type').setValue(next.type);

                        this.init_subform(next);

                        this.form.get('date').setValue(this.form.get('date').value);
                    }
                });
                break;
            case 'list_facility_room':
                this.$subscriptions[key] = this.facility_room$.all([
                    {key: 'facility_id', value: params.group_id},
                    {key: 'vacant', value: params.vacant},
                    {key: 'date', value: params.date}
                ]).pipe(first()).subscribe(res => {
                    if (res) {
                        this.facility_rooms = res;

                        if (this.edit_mode) {
                            if (this.edit_data.facility_bed !== null
                                && this.edit_data.facility_bed.room.facility.id === this.form.get('group').value.id) {
                                const rooms = this.facility_rooms.filter(v => v.id === this.edit_data.facility_bed.room.id);

                                let room;
                                if (rooms.length === 0) {
                                    room = new FacilityRoom();
                                    this.facility_rooms.push(room);

                                    room.id = this.edit_data.facility_bed.room.id;
                                    room.number = this.edit_data.facility_bed.room.number;
                                    room.beds = [this.edit_data.facility_bed];
                                } else {
                                    room = rooms[0];
                                    room.beds.push(this.edit_data.facility_bed);
                                }
                                this.form.get('facility_bed_id').setValue(this.edit_data.facility_bed.id);
                            } else {
                                this.form.get('facility_bed_id').setValue(null);
                            }
                        }
                    }
                });
                break;
            case 'list_dining_room':
                this.$subscriptions[key] = this.dining_room$.all([{key: 'facility_id', value: params.group_id}])
                    .pipe(first()).subscribe(res => {
                        if (res) {
                            this.dining_rooms = res;

                            if (!this.edit_mode) {
                                if (this.dining_rooms.filter(v => v.id === this.form.get('dining_room_id').value).length === 0) {
                                    this.form.get('dining_room_id').setValue(null);
                                }
                            } else {
                                if (this.edit_data.dining_room !== null) {
                                    if (this.dining_rooms.filter(v => v.id === this.edit_data.dining_room.id).length === 0) {
                                        this.form.get('dining_room_id').setValue(null);
                                    } else {
                                        this.form.get('dining_room_id').setValue(this.edit_data.dining_room.id);
                                    }
                                }
                            }
                        }
                    });
                break;
            case 'list_user':
                this.$subscriptions[key] = this.user$.all([
                    {key: 'facility_id', value: params['group_id']}
                ])
                    .pipe(first()).subscribe(res => {
                        if (res) {
                            this.users = res;
                        }
                    });
                break;
            case 'list_care_level':
                this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
                    if (res) {
                        this.care_levels = res;
                    }
                });
                break;
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

    public init_subform(value: any): void {
        this.form.get('facility_bed_id').disable();
        this.form.get('dining_room_id').disable();

        this.form.get('care_group').disable();
        this.form.get('care_level_id').disable();
        this.form.get('user_id').disable();

        if (value !== null) {
            const group_id = value.id;
            const group_type = value.type;

            switch (group_type) {
                case GroupType.FACILITY:
                    this.form.get('dining_room_id').enable();
                    this.form.get('facility_bed_id').enable();
                    this.form.get('care_group').enable();
                    this.form.get('care_level_id').enable();
                    this.form.get('user_id').enable();
                    this.form.get('dining_room_id').markAsUntouched();
                    this.form.get('facility_bed_id').markAsUntouched();
                    this.form.get('care_group').markAsUntouched();
                    this.form.get('care_level_id').markAsUntouched();
                    this.form.get('user_id').markAsUntouched();

                    this.subscribe('list_facility_room', {'group_id': group_id});
                    this.subscribe('list_dining_room', {'group_id': group_id});
                    this.subscribe('list_care_level');
                    this.subscribe('list_user', {'group_id': group_id});

                    break;
            }
        }
    }

    before_set_form_data(data: any, previous_data?: any): void {
        super.before_set_form_data(data, previous_data);

        if (data !== null) {
            this.edit_data = _.cloneDeep(data);

            this.form.get('group_type').setValue(data.group_type);
            this.form.get('group').setValue(null);

            switch (this.form.get('group_type').value) {
                case GroupType.FACILITY:
                    this.group_id = data.facility_bed.room.facility.id;
                    break;
                default:
                    this.group_id = null;
                    break;
            }
        }
    }

    formValue(): void {
        const value = super.formValue();
        value.date = DateHelper.makeUTCDateOnly(value.date);
        return value;
    }

    birthdayFormValue(): void {
        const value = super.formValue();
        value.birthday = DateHelper.makeUTCDateOnly(value.birthday);
        return value;
    }

    after_submit(): void {
        // const rval = this.residentSelector$.resident.value;
        // this.residentSelector$.resident.next(null);
        // this.residentSelector$.resident.next(rval);

        location.reload();
    }

    get_admission_type() {
        const type = this.admission_types.filter(v => v.id === this.form.get('admission_type').value).pop();
        return type ? type.name : null;
    }
}