import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  care_levels: CareLevel[];
  spaces: Space[];

  periods: { id: PaymentPeriod, name: string }[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

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

      resident_name: [false, Validators.required],
      date_of_birth: [false, Validators.required],
      field_name: ['', Validators.compose([Validators.maxLength(32)])],
      field_text: ['', Validators.compose([Validators.maxLength(32)])],
      reduce_for_away_days: [false, Validators.required],
    });

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
      case 'vc_care_level_adjustment':
        this.$subscriptions[key] = this.form.get('care_level_adjustment').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('amount').disable();
          } else {
            this.form.get('amount').enable();
          }
        });
        break;
      default:
        break;
    }
  }

}
