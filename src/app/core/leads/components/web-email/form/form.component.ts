import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {Space} from '../../../../models/space';
import {AuthGuard} from '../../../../guards/auth.guard';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {EmailReviewType} from '../../../models/email-review-type';
import {Facility} from '../../../../residents/models/facility';
import {FacilityService} from '../../../../residents/services/facility.service';
import {EmailReviewTypeService} from '../../../services/email-review-type.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  email_review_types: EmailReviewType[];
  facilities: Facility[];

  disabledDate: (date: Date) => boolean;

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private space$: SpaceService,
    private facility$: FacilityService,
    private email_review_type$: EmailReviewTypeService,
    private auth_$: AuthGuard
  ) {
    super(modal$);

    this.disabledDate = (current: Date): boolean => {
        const today = DateHelper.newDate();
        return differenceInCalendarDays(current, today) > 0;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      date: [DateHelper.newDate(), Validators.compose([Validators.required])],

      facility_id: [null, Validators.compose([])],
      email_review_type_id: [null, Validators.compose([])],

      subject: ['', Validators.compose([Validators.maxLength(120)])],
      name: ['', Validators.compose([Validators.maxLength(120)])],
      email: ['', Validators.compose([Validators.email])],
      phone: ['', Validators.compose([CoreValidator.phone])],
      message: ['', Validators.compose([Validators.maxLength(2048)])],
    });

    this.subscribe('list_facility');
    this.subscribe('list_email_review_type');

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
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      case 'list_email_review_type':
        this.$subscriptions[key] = this.email_review_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.email_review_types = res;
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
