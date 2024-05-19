import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {CareLevel} from '../../../models/care-level';
import {CareLevelService} from '../../../services/care-level.service';
import {CurrencyPipe} from '@angular/common';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {FacilityRoomType} from '../../../models/facility-room-type';
import {FacilityRoomTypeService} from '../../../services/facility-room-type.service';
import {FormComponent as FacilityRoomTypeFormComponent} from '../../facility-room-type/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  room_types: FacilityRoomType[];
  care_levels: CareLevel[];

  private old_date: Date = null;

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private room_type$: FacilityRoomTypeService,
    private care_level$: CareLevelService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'room_type', component: FacilityRoomTypeFormComponent}
    ];

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      date: [DateHelper.newDate(), Validators.required],
      levels: this.formBuilder.array([]),
      room_type_id: [null, Validators.compose([Validators.required])]
    });

    this.subscribe('list_room_type');
    this.subscribe('list_care_level');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_room_type':
        this.$subscriptions[key] = this.room_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.room_types = res;

            if (params) {
              this.form.get('room_type_id').setValue(params.room_type_id);
            }
          }
        });
        break;
      case 'list_care_level':
        this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;

            if (!this.edit_mode) {
              this.care_levels.forEach(value => {
                this.add_field('levels', {care_level_id: value.id, amount: 0});
              });
            } else {
              if (this.get_form_array('levels').length !== this.care_levels.length) {
                const edit_ids = this.get_form_array('levels').value.map(val => val.care_level_id);
                const all_ids = this.care_levels.map(val => val.id);
                const remaining_ids = all_ids.filter(n => !edit_ids.includes(n));

                if (remaining_ids.length > 0) {
                  const care_levels = this.care_levels.filter(val => remaining_ids.includes(val.id));

                  care_levels.forEach(value => {
                    this.add_field('levels', {care_level_id: value.id, amount: 0});
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

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'levels':
        return this.formBuilder.group({
          care_level_id: [null, Validators.required],
          amount: [null, Validators.required],
        });
      default:
        return null;
    }
  }

  after_set_form_data(): void {
    this.old_date = this.form.get('date').value;
  }

  formValue(): void {
    const value = super.formValue();

    if (this.old_date === null || value.date.getTime() !== this.old_date.getTime()) {
      value.date = DateHelper.makeUTCDateOnly(value.date);
    }

    return value;
  }

}
