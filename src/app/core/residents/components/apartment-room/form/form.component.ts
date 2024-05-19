import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ApartmentService} from '../../../services/apartment.service';
import {Apartment} from '../../../models/apartment';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as ResidentMoveComponent} from '../../resident/resident/move/form.component';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';
import {ApartmentRoom} from '../../../models/apartment-room';
import {ApartmentRoomService} from '../../../services/apartment-room.service';
import {GroupType} from '../../../models/group-type.enum';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  apartments: Apartment[];

  apartment: Apartment = null;
  other_occupation: number;
  room_orig_occupation: number;
  room_curr_occupation: number;

  button_loading: Array<boolean>;

  @ViewChild('addBed') btn_add_bed;

  constructor(
    private formBuilder: FormBuilder,
    private apartment$: ApartmentService,
    private apartment_room$: ApartmentRoomService,
    protected modal$: NzModalService,
    protected resident$: ResidentService,
    protected residentAdmission$: ResidentAdmissionService
  ) {
    super();

    this.room_orig_occupation = 0;
    this.room_curr_occupation = 0;
    this.other_occupation = 0;

    this.button_loading = new Array<boolean>(100);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      number: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(10)])],
      floor: ['', Validators.compose([Validators.required, CoreValidator.floor])],
      notes: ['', Validators.compose([Validators.maxLength(1000)])],

      beds: this.formBuilder.array([]),

      apartment_id: [null, Validators.required]
    });

    this.subscribe('vc_beds');
    this.subscribe('vc_apartment_id');
    this.subscribe('list_apartment');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_apartment':
        this.$subscriptions[key] = this.apartment$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.apartments = res;

            this.form.get('apartment_id').setValue(this.form.get('apartment_id').value);
          }
        });
        break;
      case 'vc_apartment_id':
        this.$subscriptions[key] = this.form.get('apartment_id').valueChanges.subscribe(next => {
          if (next) {
            if (this.apartments) {
              this.apartment = this.apartments.filter(v => v.id === next).pop();
              this.other_occupation = this.apartment.occupation - this.room_orig_occupation;
            }
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
          number: ['', Validators.compose([Validators.required])],
          enabled: [true, Validators.compose([Validators.required])],
          resident_id: [null],
        });
      default:
        return null;
    }
  }

  after_set_form_data(): void {
    const apartment_id = this.form.get('apartment_id');
    // console.log(apartment_id);
    if (apartment_id.value) {
      // apartment_id.disable();
    }

    this.room_orig_occupation = (<FormArray>this.form.get('beds')).controls.length;
    this.room_curr_occupation = this.room_orig_occupation;
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
  }


  show_modal_move(key: string, i: number, bed_id: number, room: ApartmentRoom, resident: Resident): void {
    let valid = false;
    let loading = false;

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
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
            const form_data = component.formObject.value;
            component.submitted = true;

            this.residentAdmission$.move(form_data).subscribe(
              res => {
                this.apartment_room$.get(room.id).pipe(first()).subscribe(next => {
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
              group_type: GroupType.APARTMENT,
              group_id: this.apartment.id,
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
    if (data === null && previous_data !== null) {
      if (previous_data.hasOwnProperty('apartment_id')) {
        this.apartment_room$.last_number(previous_data.apartment_id).subscribe(res => {
          if (res) {
            const number = res[0].replace(/(\d+)$/, function (match, n) {
              return ++n;
            });
            this.form.get('number').setValue(number);
          } else {
            if (previous_data.hasOwnProperty('number')) {
              const number = previous_data.number.replace(/(\d+)$/, function (match, n) {
                return ++n;
              });
              this.form.get('number').setValue(number);
            }
          }
        });

        this.form.get('apartment_id').setValue(previous_data.apartment_id);
        if (previous_data.hasOwnProperty('floor')) {
          this.form.get('floor').setValue(previous_data.floor);
        }
      }
    }
  }
}
