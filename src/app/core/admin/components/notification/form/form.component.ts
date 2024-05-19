import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {UserService} from '../../../services/user.service';
import {User} from '../../../../models/user';
import {NotificationTypeService} from '../../../services/notification-type.service';
import {NotificationType} from '../../../../models/notification-type';
import {Facility} from '../../../../residents/models/facility';
import {Region} from '../../../../residents/models/region';
import {Apartment} from '../../../../residents/models/apartment';
import {FacilityService} from '../../../../residents/services/facility.service';
import {RegionService} from '../../../../residents/services/region.service';
import {ApartmentService} from '../../../../residents/services/apartment.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  notification_types: NotificationType[];
  users: User[];
  facilities: Facility[];
  regions: Region[];
  apartments: Apartment[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private notification_type$: NotificationTypeService,
    private facility$: FacilityService,
    private region$: RegionService,
    private apartment$: ApartmentService,
    private user$: UserService,
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      enabled: [true, Validators.required],
      type_id: [null, Validators.required],
      users: [[], Validators.required],
      schedule: ['', Validators.required],
      emails: [[]],

      facilities: [[]],
      apartments: [[]],
      regions: [[]]
    });
    this.form.get('facilities').disable();
    this.form.get('regions').disable();
    this.form.get('apartments').disable();

    this.subscribe('list_facility');
    this.subscribe('list_region');
    this.subscribe('list_apartment');
    this.subscribe('list_user');
    this.subscribe('list_notification_type');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_notification_type':
        this.$subscriptions[key] = this.notification_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.notification_types = res;

            this.subscribe('vc_type_id');
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
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      case 'list_region':
        this.$subscriptions[key] = this.region$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.regions = res;
          }
        });
        break;
      case 'list_apartment':
        this.$subscriptions[key] = this.apartment$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.apartments = res;
          }
        });
        break;
      case 'vc_type_id':
        this.$subscriptions[key] = this.form.get('type_id').valueChanges.subscribe(next => {
          if (next) {
            const notification_type = this.notification_types.filter(item => item.id === next).pop();

            if (notification_type.facility) {
              this.form.get('facilities').enable();
            } else {
              this.form.get('facilities').disable();
            }
            if (notification_type.region) {
              this.form.get('regions').enable();
            } else {
              this.form.get('regions').disable();
            }
            if (notification_type.apartment) {
              this.form.get('apartments').enable();
            } else {
              this.form.get('apartments').disable();
            }
          }
        });
        break;
      default:
        break;
    }
  }
}
