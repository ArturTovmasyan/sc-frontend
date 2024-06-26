﻿import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {FormComponent as ResidentMoveComponent} from '../../resident/resident/move/form.component';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';
import {FacilityRoom} from '../../../models/facility-room';
import {FacilityRoomService} from '../../../services/facility-room.service';
import {GroupType} from '../../../models/group-type.enum';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {NzModalService} from 'ng-zorro-antd';
import {FacilityRoomType} from '../../../models/facility-room-type';
import {FacilityRoomTypeService} from '../../../services/facility-room-type.service';
import {FormComponent as FacilityRoomTypeFormComponent} from '../../facility-room-type/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  facilities: Facility[];
  facility_room_private_types: FacilityRoomType[];
  facility_room_shared_types: FacilityRoomType[];

  facility: Facility = null;
  other_occupation: number;
  room_orig_occupation: number;
  room_curr_occupation: number;

  bed_resident_map: any = {};

  button_loading: Array<boolean>;

  @ViewChild('addBed', {static: false}) btn_add_bed;

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private facility_room$: FacilityRoomService,
    private room_type$: FacilityRoomTypeService,
    protected resident$: ResidentService,
    protected residentAdmission$: ResidentAdmissionService,
    private nzModal$: NzModalService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'room_type', component: FacilityRoomTypeFormComponent}
    ];

    this.room_orig_occupation = 0;
    this.room_curr_occupation = 0;
    this.other_occupation = 0;

    this.button_loading = new Array<boolean>(100);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      number: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(10), CoreValidator.room])],
      floor: ['', Validators.compose([CoreValidator.notEmpty, CoreValidator.floor])],
      notes: ['', Validators.compose([Validators.maxLength(1000)])],

      beds: this.formBuilder.array([]),

      private_type_id: [null, CoreValidator.notNullOneOf(['private_type_id', 'shared_type_id'], 'No room type selected.')],
      shared_type_id: [null, CoreValidator.notNullOneOf(['private_type_id', 'shared_type_id'], 'No room type selected.')],
      facility_id: [null, Validators.required]
    });

    this.form.get('private_type_id').disable();
    this.form.get('shared_type_id').disable();

    this.subscribe('vc_beds');
    this.subscribe('vc_facility_id');
    this.subscribe('list_facility');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'get_beds':
        this.$subscriptions[key] = this.residentAdmission$.get_beds({type: GroupType.FACILITY, ids: params.beds})
          .pipe(first()).subscribe(res => {
            if (res) {
              this.bed_resident_map = res[0];
            }
          });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;

            this.form.get('facility_id').setValue(this.form.get('facility_id').value);
          }
        });
        break;
      case 'list_room_type':
        this.$subscriptions[key] = this.room_type$.all([{
          key: 'facility_id',
          value: this.form.get('facility_id').value
        }]).pipe(first()).subscribe(res => {
          if (res) {
            this.facility_room_private_types = res.filter(value => value.private === true);
            this.facility_room_shared_types = res.filter(value => value.private === false);

            this.form.get('private_type_id').enable();
            this.form.get('shared_type_id').enable();

            if (params && params.room_type_id) {
              const room_type = res.filter(value => value.id === params.room_type_id).pop();

              if (room_type) {
                if (room_type.private === true) {
                  this.form.get('private_type_id').setValue(params.room_type_id);
                } else if (room_type.private === false) {
                  this.form.get('shared_type_id').setValue(params.room_type_id);
                }
              }
            } else {
              this.form.get('private_type_id').setValue(this.form.get('private_type_id').value);
              this.form.get('shared_type_id').setValue(this.form.get('shared_type_id').value);
            }

            this.form.get('private_type_id').markAsTouched();
            this.form.get('private_type_id').updateValueAndValidity();
          }
        });
        break;
      case 'vc_facility_id':
        this.$subscriptions[key] = this.form.get('facility_id').valueChanges.subscribe(next => {
          if (next) {
            if (this.facilities) {
              this.facility = this.facilities.filter(v => v.id === next).pop();
              this.other_occupation = this.facility.occupation - this.room_orig_occupation;
            }

            this.subscribe('list_room_type');
          }
        });
        break;
      case 'vc_beds':
        this.$subscriptions[key] = this.form.get('beds').valueChanges.subscribe(next => {
          this.room_curr_occupation = next.length;
        });
        break;
      default:
        break;
    }
  }

  public get_form_array_skeleton(key: string): FormGroup | FormControl {
    switch (key) {
      case 'beds':
        return this.formBuilder.group({
          id: [''],
          number: ['', Validators.compose([CoreValidator.notEmpty])],
          enabled: [true, Validators.compose([Validators.required])],
          resident_id: [null],
        });
      default:
        return null;
    }
  }

  after_set_form_data(): void {
    const facility_id = this.form.get('facility_id');
    // console.log(facility_id);
    if (facility_id.value) {
      // facility_id.disable();
    }

    this.room_orig_occupation = (<FormArray>this.form.get('beds')).controls.length;
    this.room_curr_occupation = this.room_orig_occupation;

    const beds = (<FormArray>this.form.get('beds')).controls;
    const ids = [];

    for (let i = 0; i < beds.length; i++) {
      ids.push(beds[i].get('id').value);
    }

    this.subscribe('get_beds', {beds: ids});
  }

  remove_field(key: string, i: number): void {
    if (key === 'beds') {
      const control = this.get_form_array(key).get(i.toString());
      const id = control.get('id').value;
      const resident_id = control.get('resident_id').value;
      if (resident_id) {
        this.button_loading[i] = true;
        this.resident$.get(resident_id).pipe(first()).subscribe(res => {
          if (res) {
            this.button_loading[i] = false;

            const room = this.form.value;

            this.show_modal_move(key, i, id, room, res); // TODO(haykg): convert to observable
          }
        });
      } else {
        super.remove_field(key, i);
      }
    } else {
      super.remove_field(key, i);
    }

    const controls = this.get_form_array(key).controls;

    controls.forEach(control => {
      control.setValue(control.value);
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });
  }


  show_modal_move(key: string, i: number, bed_id: number, room: FacilityRoom, resident: Resident): void {
    let valid = false;
    let loading = false;

    const modal = this.nzModal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: ResidentMoveComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => {
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Move',
          loading: () => loading,
          disabled: () => !valid,
          onClick: () => {
            loading = true;

            const component = <AbstractForm>modal.getContentComponent();
            component.before_submit();
            const form_data = component.formValue();
            component.submitted = true;

            this.residentAdmission$.move(form_data).subscribe(
              res => {
                this.facility_room$.get(room.id).pipe(first()).subscribe(next => {
                  loading = false;
                  super.remove_field(key, i);

                  const form_beds = (<FormArray>this.form.get('beds')).controls;

                  next.beds.forEach(bed => {
                    const form_bed = form_beds.filter(v => v.get('id').value === bed.id).pop();

                    if (form_bed) {
                      form_bed.patchValue({resident_id: bed.resident ? bed.resident.id : null});
                      // console.log(this.form);
                    }
                  });

                  modal.close();
                });
              },
              error => {
                loading = false;

                component.handleSubmitError(error);
                component.postSubmit(null);
                // console.error(error);
              });
          }
        }
      ]
    });

    modal.afterOpen.subscribe(() => {
      const component = <ResidentMoveComponent>modal.getContentComponent();

      component.resident = resident;
      component.current_room = {id: room.id, number: room.number, beds: room.beds.filter(v => (v.id && v.id !== bed_id))};
      component.show_group = false;

      if (component instanceof AbstractForm) {
        const form = component.formObject;

        component.loaded.subscribe(v => {
          if (v) {
            const result = {
              id: resident.id,
              group_type: GroupType.FACILITY,
              group_id: this.facility.id,
              bed_id: bed_id
            };

            component.before_set_form_data(result);
            component.set_form_data(component, form, result);
            component.after_set_form_data();
          }
        });

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });

  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (data === null && previous_data !== null) {
      if (previous_data.hasOwnProperty('facility_id')) {
        if (previous_data.hasOwnProperty('number')) {
          const number = previous_data.number.replace(/(\d+)$/, function (match, n) {
            return ++n;
          });
          this.form.get('number').setValue(number);
        }

        this.form.get('facility_id').setValue(previous_data.facility_id);
        if (previous_data.hasOwnProperty('floor')) {
          this.form.get('floor').setValue(previous_data.floor);
        }
      }
    }
  }

  before_submit(): void {
    this.form.get('facility_id').enable();
  }

  get_resident_of_bed(i: number) {
    const bed_id = this.form.get('beds.' + i + '.id').value;

    if (bed_id !== null && this.bed_resident_map.hasOwnProperty(bed_id) && this.bed_resident_map[bed_id]) {
      const resident = this.bed_resident_map[bed_id][0];

      return resident ? `${resident}` : 'Unoccupied';
    }

    return 'Unoccupied';
  }
}
