import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ApartmentService} from '../../../services/apartment.service';
import {Apartment} from '../../../models/apartment';
import {ValidationPatterns} from '../../../../../shared/constants/validation.patterns';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as ResidentMoveComponent} from '../../resident/move/form.component';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';
import {ApartmentBed, ApartmentRoom} from '../../../models/apartment-room';
import {ApartmentRoomService} from '../../../services/apartment-room.service';
import {ResidentType} from '../../../models/resident-type.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  facilities: Apartment[];

  apartment: Apartment = null;
  other_occupation: number;
  room_orig_occupation: number;
  room_curr_occupation: number;

  button_loading: Array<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private apartment$: ApartmentService,
    private apartment_room$: ApartmentRoomService,
    protected modal$: NzModalService,
    protected resident$: ResidentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      number: ['', Validators.compose([Validators.required])],
      floor: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.FLOOR)])],
      notes: ['', Validators.compose([Validators.max(1000)])],

      beds: this.formBuilder.array([]),

      apartment_id: [null, Validators.required]
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;

        this.form.get('beds').valueChanges.subscribe(next => {
          this.room_curr_occupation = next.length;
        });

        this.form.get('apartment_id').valueChanges.subscribe(next => {
          this.apartment = this.facilities.filter(v => v.id === next).pop();
          this.other_occupation = this.apartment.occupation - this.room_orig_occupation;
        });

        this.form.get('apartment_id').setValue(this.form.get('apartment_id').value);
      }
    });

  }

  public get_form_array_skeleton(key: string): FormGroup | FormControl {
    switch (key) {
      case 'beds':
        return this.formBuilder.group({
          id: [''],
          number: ['', Validators.compose([Validators.required])],
          disabled: [false, Validators.compose([Validators.required])],
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

    this.button_loading = new Array<boolean>(10 * (<FormArray>this.form.get('beds')).controls.length);
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

            this.resident$.move(form_data).subscribe(
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
            component.before_set_form_data();
            component.set_form_data(component, form, {
              id: resident.id,
              group_type: ResidentType.FACILITY,
              group_id: this.apartment.id,
              bed_id: bed_id
            });
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
}
