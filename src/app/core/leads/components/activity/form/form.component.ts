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
import {FormComponent as ActivityStatusFormComponent} from '../../activity-status/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {DateHelper} from '../../../../../shared/helpers/date-helper';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  activity_types: ActivityType[];
  activity_statuses: ActivityStatus[];
  users: User[];
  facilities: Facility[];

  constructor(
    private formBuilder: FormBuilder,
    private modal$: NzModalService,
    private activity_type$: ActivityTypeService,
    private activity_status$: ActivityStatusService,
    private facility$: FacilityService,
    private user$: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      type_id: [null, Validators.compose([])],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      date: [new Date(), Validators.required],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      due_date: [new Date(), Validators.required],
      reminder_date: [new Date(), Validators.required],

      status_id: [null, Validators.compose([Validators.required])],
      assign_to_id: [null, Validators.compose([Validators.required])],
      facility_id: [null, Validators.compose([Validators.required])],

      owner_type: [null, Validators.compose([])],
      lead_id: [null, Validators.compose([])],
      referral_id: [null, Validators.compose([])],
      organization_id: [null, Validators.compose([])],

      outreach_id: [null, Validators.compose([])],
    });

    this.form.get('facility_id').disable();
    this.form.get('assign_to_id').disable();
    this.form.get('status_id').disable();
    this.form.get('due_date').disable();
    this.form.get('reminder_date').disable();

    this.subscribe('list_activity_type');
    this.subscribe('list_activity_status');
    this.subscribe('list_facility');
    this.subscribe('list_user');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_activity_type':
        this.unsubscribe('vc_activity_type');
        this.$subscriptions[key] = this.activity_type$.all().pipe(first()).subscribe(res => {
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
              this.form.get('status_id').setValue(params.activity_type_id);
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

            } else {
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

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'activity_status':
        this.create_modal(
          this.modal$,
          ActivityStatusFormComponent,
          data => this.activity_status$.add(data),
          data => {
            this.subscribe('list_activity_status', {activity_status_id: data[0]});
            return null;
          });
        break;
      case 'activity_type':
        this.create_modal(
          this.modal$,
          ActivityStatusFormComponent,
          data => this.activity_type$.add(data),
          data => {
            this.subscribe('list_activity_type', {activity_type_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      data.date = DateHelper.convertUTC(data.date);
      data.due_date = DateHelper.convertUTC(data.due_date);
      data.reminder_date = DateHelper.convertUTC(data.reminder_date);
    }
  }
}
