import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {PhoneType} from '../../../../models/phone-type.enum';
import {ReferrerType} from '../../../models/referrer-type';
import {ReferrerTypeService} from '../../../services/referrer-type.service';
import {Organization} from '../../../models/organization';
import {OrganizationService} from '../../../services/organization.service';
import {CityStateZip} from '../../../../residents/models/city-state-zip';
import {CareType} from '../../../models/care-type';
import {User} from '../../../../models/user';
import {StateChangeReason} from '../../../models/state-change-reason';
import {Facility} from '../../../../residents/models/facility';
import {CityStateZipService} from '../../../../residents/services/city-state-zip.service';
import {CareTypeService} from '../../../services/care-type.service';
import {FacilityService} from '../../../../residents/services/facility.service';
import {UserService} from '../../../../admin/services/user.service';
import {StateChangeReasonService} from '../../../services/state-change-reason.service';
import {PaymentSource} from '../../../../residents/models/payment-source';
import {PaymentSourceService} from '../../../../residents/services/payment-source.service';
import {LeadState} from '../../../models/lead';
import {FormComponent as OrganizationFormComponent} from '../../organization/form/form.component';
import {FormComponent as CareTypeFormComponent} from '../../care-type/form/form.component';
import {FormComponent as StateChangeReasonFormComponent} from '../../state-change-reason/form/form.component';
import {FormComponent as ReferrerTypeFormComponent} from '../../referrer-type/form/form.component';
import {FormComponent as CSZFormComponent} from '../../../../residents/components/city-state-zip/form/form.component';
import {FormComponent as PaymentSourceFormComponent} from '../../../../residents/components/payment-source/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  city_state_zips: CityStateZip[];
  payment_sources: PaymentSource[];
  users: User[];

  care_types: CareType[];
  state_change_reasons: StateChangeReason[];

  referrer_types: ReferrerType[];

  facilities: Facility[];

  organizations: Organization[];

  phone_types: { id: PhoneType, name: string }[];

  selectedTab: number;

  constructor(
    private formBuilder: FormBuilder,
    private _el: ElementRef,
    private modal$: NzModalService,
    private csz$: CityStateZipService,
    private payment_source$: PaymentSourceService,
    private user$: UserService,
    private facility$: FacilityService,
    private care_type$: CareTypeService,
    private state_change_reason$: StateChangeReasonService,
    private organization$: OrganizationService,
    private referrer_type$: ReferrerTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedTab = 0;

    this.form = this.formBuilder.group({
      id: [''],

      first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      care_type_id: [null, Validators.compose([])],
      payment_type_id: [null, Validators.compose([])],
      owner_id: [null, Validators.compose([Validators.required])],

      initial_contact_date: [new Date(), Validators.compose([Validators.required])],

      state: [LeadState.OPEN, Validators.compose([])],

      state_change_reason_id: [null, Validators.compose([])],
      state_effective_date: [new Date(), Validators.compose([])],

      responsible_person_first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      responsible_person_last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      responsible_person_address_1: ['', Validators.compose([Validators.maxLength(100)])],
      responsible_person_address_2: ['', Validators.compose([Validators.maxLength(100)])],
      responsible_person_csz_id: [null, Validators.compose([])],
      responsible_person_email: ['', Validators.compose([Validators.email])],
      responsible_person_phone: ['', Validators.compose([CoreValidator.phone])],

      referral: this.formBuilder.group({
        id: [''],
        type_id: [null, Validators.compose([Validators.required])],
        organization_id: [null, Validators.compose([Validators.required])],
        first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
        last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
        notes: ['', Validators.compose([Validators.maxLength(512)])],
        emails: [[], Validators.compose([Validators.required])],
        phones: this.formBuilder.array([]),
      }),

      primary_facility_id: [null, Validators.compose([])],
      facilities: [[], Validators.compose([])],
      notes: ['', Validators.compose([Validators.maxLength(512)])],


      phones: this.formBuilder.array([]),
    });

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };

    this.form.get('referral.organization_id').disable();
    this.form.get('referral.first_name').disable();
    this.form.get('referral.last_name').disable();
    this.form.get('referral.notes').disable();
    this.form.get('referral.emails').disable();
    this.form.get('referral.phones').disable();

    this.phone_types = [
      {id: PhoneType.HOME, name: 'HOME'},
      {id: PhoneType.MOBILE, name: 'MOBILE'},
      {id: PhoneType.WORK, name: 'WORK'},
      {id: PhoneType.OFFICE, name: 'OFFICE'},
      {id: PhoneType.EMERGENCY, name: 'EMERGENCY'},
      {id: PhoneType.FAX, name: 'FAX'},
      {id: PhoneType.ROOM, name: 'ROOM'}
    ];

    this.subscribe('list_csz');
    this.subscribe('list_payment_source');
    this.subscribe('list_user');
    this.subscribe('list_facility');
    this.subscribe('list_care_type');
    this.subscribe('list_state_change_reason');

    this.subscribe('list_organization');
    this.subscribe('list_referrer_type');
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'referral.phones':
        return this.formBuilder.group({
          id: [null],
          type: [null, Validators.required],
          number: ['', Validators.compose([Validators.required, CoreValidator.phone])],
          primary: [false],
          compatibility: [null]
        });
      default:
        return null;
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_csz':
        this.$subscriptions[key] = this.csz$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;

            if (params) {
              this.form.get('responsible_person_csz_id').setValue(params.csz_id);
            }
          }
        });
        break;
      case 'list_payment_source':
        this.$subscriptions[key] = this.payment_source$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.payment_sources = res;

            if (params) {
              this.form.get('payment_type_id').setValue(params.payment_type_id);
            }
          }
        });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;

            if (params) {
              /// ???
              this.form.get('facility_id').setValue(params.facility_id);
            }
          }
        });
        break;
      case 'list_user':
        this.$subscriptions[key] = this.user$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.users = res;

            if (params) {
              this.form.get('owner_id').setValue(params.owner_id);
            }
          }
        });
        break;
      case 'list_care_type':
        this.$subscriptions[key] = this.care_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_types = res;

            if (params) {
              this.form.get('care_type_id').setValue(params.care_type_id);
            }
          }
        });
        break;
      case 'list_state_change_reason':
        this.$subscriptions[key] = this.state_change_reason$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.state_change_reasons = res;

            if (params) {
              this.form.get('state_change_reason_id').setValue(params.state_change_reason_id);
            }
          }
        });
        break;
      case 'list_referrer_type':
        this.unsubscribe('vc_referrer_type');
        this.$subscriptions[key] = this.referrer_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.referrer_types = res;

            if (params) {
              this.form.get('referral.type_id').setValue(params.type_id);
            }

            this.subscribe('vc_referrer_type');
            this.form.get('referral.type_id').setValue(this.form.get('referral.type_id').value);
          }
        });
        break;
      case 'list_organization':
        this.$subscriptions[key] = this.organization$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.organizations = res;

            if (params) {
              this.form.get('referral.organization_id').setValue(params.organization_id);
            }
          }
        });
        break;
      case 'vc_referrer_type':
        this.$subscriptions[key] = this.form.get('referral.type_id').valueChanges.subscribe(next => {
          if (next) {
            const type = this.referrer_types.filter(v => v.id === next).pop();

            if (type) {
              if (type.organization_required) {
                this.form.get('referral.organization_id').enable();
              } else {
                this.form.get('referral.organization_id').disable();
              }

              if (type.representative_required) {
                this.form.get('referral.first_name').enable();
                this.form.get('referral.last_name').enable();
                this.form.get('referral.notes').enable();
                this.form.get('referral.emails').enable();
                this.form.get('referral.phones').enable();
              } else {
                this.form.get('referral.first_name').disable();
                this.form.get('referral.last_name').disable();
                this.form.get('referral.notes').disable();
                this.form.get('referral.emails').disable();
                this.form.get('referral.phones').disable();
              }
            } else {
              this.form.get('referral.organization_id').disable();

              this.form.get('referral.first_name').disable();
              this.form.get('referral.last_name').disable();
              this.form.get('referral.notes').disable();
              this.form.get('referral.emails').disable();
              this.form.get('referral.phones').disable();
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
      case 'organization':
        this.create_modal(
          this.modal$,
          OrganizationFormComponent,
          data => this.organization$.add(data),
          data => {
            this.subscribe('list_organization', {organization_id: data[0]});
            return null;
          });
        break;
      case 'csz':
        this.create_modal(
          this.modal$,
          CSZFormComponent,
          data => this.csz$.add(data),
          data => {
            this.subscribe('list_csz', {csz_id: data[0]});
            return null;
          });
        break;
      case 'payment_source':
        this.create_modal(
          this.modal$,
          PaymentSourceFormComponent,
          data => this.payment_source$.add(data),
          data => {
            this.subscribe('list_payment_source', {payment_type_id: data[0]});
            return null;
          });
        break;
      case 'care_type':
        this.create_modal(
          this.modal$,
          CareTypeFormComponent,
          data => this.care_type$.add(data),
          data => {
            this.subscribe('list_care_type', {care_type_id: data[0]});
            return null;
          });
        break;
      case 'state_change_reason':
        this.create_modal(
          this.modal$,
          StateChangeReasonFormComponent,
          data => this.state_change_reason$.add(data),
          data => {
            this.subscribe('list_state_change_reason', {state_change_reason_id: data[0]});
            return null;
          });
        break;
      case 'referrer_type':
        this.create_modal(
          this.modal$,
          ReferrerTypeFormComponent,
          data => this.referrer_type$.add(data),
          data => {
            this.subscribe('list_referrer_type', {type_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }
}
