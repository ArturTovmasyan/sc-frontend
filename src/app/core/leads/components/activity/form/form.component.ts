import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ActivityStatus} from '../../../models/activity-status';
import {ActivityType} from '../../../models/activity-type';
import {User} from '../../../../models/user';
import {Facility} from '../../../../residents/models/facility';
import {UserService} from '../../../../admin/services/user.service';
import {FacilityService} from '../../../../residents/services/facility.service';
import {ActivityStatusService} from '../../../services/activity-status.service';
import {ActivityTypeService} from '../../../services/activity-type.service';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as ActivityTypeFormComponent} from '../../activity-type/form/form.component';
import {FormComponent as ActivityStatusFormComponent} from '../../activity-status/form/form.component';
import {FormComponent as ContactFormComponent} from '../../contact/form/form.component';
import {Contact} from '../../../models/contact';
import {ContactService} from '../../../services/contact.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  activity_types: ActivityType[];
  activity_statuses: ActivityStatus[];
  users: User[];
  facilities: Facility[];
  contacts: Contact[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private activity_type$: ActivityTypeService,
    private activity_status$: ActivityStatusService,
    private facility$: FacilityService,
    private contact$: ContactService,
    private user$: UserService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'activity_type', component: ActivityTypeFormComponent},
      {key: 'activity_status', component: ActivityStatusFormComponent},
      {key: 'contact', component: ContactFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      type_id: [null, Validators.compose([])],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      date: [DateHelper.newDate(), Validators.required],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      due_date: [DateHelper.newDate(), Validators.required],
      reminder_date: [DateHelper.newDate(), Validators.required],

      status_id: [null, Validators.compose([Validators.required])],
      assign_to_id: [null, Validators.compose([Validators.required])],
      facility_id: [null, Validators.compose([Validators.required])],

      task_contact_id: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],

      owner_type: [null, Validators.compose([])],
      lead_id: [null, Validators.compose([])],
      referral_id: [null, Validators.compose([])],
      organization_id: [null, Validators.compose([])],

      outreach_id: [null, Validators.compose([])],
      contact_id: [null, Validators.compose([])],
    });

    this.form.get('task_contact_id').disable();
    this.form.get('amount').disable();

    this.form.get('facility_id').disable();
    this.form.get('assign_to_id').disable();
    this.form.get('status_id').disable();
    this.form.get('due_date').disable();
    this.form.get('reminder_date').disable();

    this.subscribe('vc_owner_type');
    this.subscribe('list_activity_status');
    this.subscribe('list_facility');
    this.subscribe('list_contact');
    this.subscribe('list_user');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'vc_owner_type':
        this.$subscriptions[key] = this.form.get('owner_type').valueChanges.subscribe(next => {
          if (next != null) {
            this.subscribe('list_activity_type');
          }
        });
        break;
      case 'list_activity_type':
        this.unsubscribe('vc_activity_type');
        this.$subscriptions[key] = this.activity_type$
          .all([{key: 'category', value: this.form.get('owner_type').value}])
          .pipe(first()).subscribe(res => {
          if (res) {
            this.activity_types = res;

            this.subscribe('vc_activity_type');

            if (params) {
              this.form.get('type_id').setValue(params.activity_type_id);
            } else {
              this.form.get('type_id').setValue(this.form.get('type_id').value);
            }
          }
        });
        break;
      case 'list_activity_status':
        this.$subscriptions[key] = this.activity_status$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.activity_statuses = res;

            if (params) {
              this.form.get('status_id').setValue(params.activity_status_id);
            }
          }
        });
        break;
      case 'list_contact':
        this.$subscriptions[key] = this.contact$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.contacts = res;

            if (params) {
              this.form.get('task_contact_id').setValue(params.contact_id);
            }
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
      case 'list_user':
        this.$subscriptions[key] = this.user$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.users = res;
          }
        });
        break;
      case 'vc_activity_type':
        this.$subscriptions[key] = this.form.get('type_id').valueChanges.subscribe(next => {
          if (next) {
            const type = this.activity_types.filter(v => v.id === next).pop();

            if (type) {
              if (type.facility) {
                this.form.get('facility_id').enable();
              } else {
                this.form.get('facility_id').disable();
              }

              if (type.assign_to) {
                this.form.get('assign_to_id').enable();
              } else {
                this.form.get('assign_to_id').disable();
              }

              if (type.default_status.done === false) {
                this.form.get('status_id').enable();
              } else {
                this.form.get('status_id').disable();
              }

              if (type.due_date) {
                this.form.get('due_date').enable();
              } else {
                this.form.get('due_date').disable();
              }

              if (type.reminder_date) {
                this.form.get('reminder_date').enable();
              } else {
                this.form.get('reminder_date').disable();
              }

              if (type.contact) {
                this.form.get('task_contact_id').enable();
              } else {
                this.form.get('task_contact_id').disable();
              }

              if (type.amount) {
                this.form.get('amount').enable();
              } else {
                this.form.get('amount').disable();
              }

            } else {
              this.form.get('task_contact_id').disable();
              this.form.get('amount').disable();
              this.form.get('facility_id').disable();
              this.form.get('assign_to_id').disable();
              this.form.get('status_id').disable();
              this.form.get('due_date').disable();
              this.form.get('reminder_date').disable();
            }
          }
        });
        break;
      default:
        break;
    }
  }

}
