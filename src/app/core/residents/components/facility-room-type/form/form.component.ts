import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Facility} from '../../../models/facility';
import {FacilityService} from '../../../services/facility.service';
import {CareLevel} from '../../../models/care-level';
import {CareLevelService} from '../../../services/care-level.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  facilities: Facility[];
  care_levels: CareLevel[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private care_level$: CareLevelService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(255)])],
      description: ['', Validators.compose([Validators.maxLength(255)])],

      private: [false, Validators.required],

      base_rates: this.formBuilder.array([]),

      facility_id: [null, Validators.compose([Validators.required])]
    });

    this.subscribe('list_facility');
    this.subscribe('list_care_level');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      case 'list_care_level':
        this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;

            if (!this.edit_mode) {
              this.care_levels.forEach(value => {
                this.add_field('base_rates', {care_level_id: value.id, amount: 0});
              });
            } else {
              if (this.get_form_array('base_rates').length !== this.care_levels.length) {
                const edit_ids = this.get_form_array('base_rates').value.map(val => val.care_level_id);
                const all_ids = this.care_levels.map(val => val.id);
                const remaining_ids = all_ids.filter(n => !edit_ids.includes(n));

                if (remaining_ids.length > 0) {
                  const care_levels = this.care_levels.filter(val => remaining_ids.includes(val.id));

                  care_levels.forEach(value => {
                    this.add_field('base_rates', {care_level_id: value.id, amount: 0});
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
      case 'base_rates':
        return this.formBuilder.group({
          care_level_id: [null, Validators.required],
          amount: [null, Validators.required],
        });
      default:
        return null;
    }
  }
}
