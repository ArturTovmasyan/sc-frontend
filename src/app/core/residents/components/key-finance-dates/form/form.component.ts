import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {Space} from '../../../../models/space';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {KeyFinanceCategory} from '../../../../models/key-finance-category.enum';
import {DateHelper} from '../../../../../shared/helpers/date-helper';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  types: { id: KeyFinanceCategory, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      type: [null, Validators.required],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(255)])],
      date: [DateHelper.newDate(), Validators.required],
      description: ['', Validators.compose([Validators.maxLength(256)])],
    });

    this.types = [
      {id: KeyFinanceCategory.MONTHLY_BILLING_CUT_OFF_DATE, name: 'list.key_finance_type.MONTHLY_BILLING_CUT_OFF_DATE'},
      {id: KeyFinanceCategory.BILLING_STATEMENTS_DELIVERY_DATE, name: 'list.key_finance_type.BILLING_STATEMENTS_DELIVERY_DATE'},
      {id: KeyFinanceCategory.CALCULATE_RENT_DUE_DATE, name: 'list.key_finance_type.CALCULATE_RENT_DUE_DATE'},
      {id: KeyFinanceCategory.RENT_PAYMENT_DELINQUENT_DATE, name: 'list.key_finance_type.RENT_PAYMENT_DELINQUENT_DATE'}
    ];

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
      default:
        break;
    }
  }

  formValue(): void {
    const value = super.formValue();
    value.date = DateHelper.makeUTCDateOnly(value.date);
    return value;
  }
}
