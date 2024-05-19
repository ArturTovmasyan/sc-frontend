import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../models/space';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {CareLevel} from '../../../models/care-level';
import {CareLevelService} from '../../../services/care-level.service';
import {PaymentPeriod} from '../../../models/payment-period.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  care_levels: CareLevel[];
  spaces: Space[];

  periods: { id: PaymentPeriod, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private care_level$: CareLevelService,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(255)])],

      away_reduction: [false, Validators.required],

      period: [null, Validators.compose([Validators.required])],

      care_level_adjustment: [false, Validators.required],
      amount: [null, Validators.compose([Validators.required])],
      base_rates: this.formBuilder.array([]),
    });

    this.form.get('base_rates').disable();

    this.periods = [
      {id: PaymentPeriod.DAILY, name: 'Daily'},
      {id: PaymentPeriod.WEEKLY, name: 'Weekly'},
      {id: PaymentPeriod.MONTHLY, name: 'Monthly'},
    ];

    this.subscribe('vc_care_level_adjustment');

    this.add_space();
  }

  private add_space() {
    if (this.auth_$.checkPermission(['persistence-security-space'])) {
      this.form.addControl('space_id', new FormControl(null, [Validators.required]));
      this.subscribe('list_space');
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      case 'list_care_level':
        this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;

            if (!this.edit_mode) {
              this.get_form_array('base_rates').clear();
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
      case 'vc_care_level_adjustment':
        this.$subscriptions[key] = this.form.get('care_level_adjustment').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('amount').disable();
            this.form.get('base_rates').enable();
            this.subscribe('list_care_level');
          } else {
            this.form.get('amount').enable();
            this.form.get('base_rates').disable();
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
