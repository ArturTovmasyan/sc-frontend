import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {PhoneType} from '../../../../models/phone-type.enum';
import {ReferrerType} from '../../../models/referrer-type';
import {ReferrerTypeService} from '../../../services/referrer-type.service';
import {Lead} from '../../../models/lead';
import {Organization} from '../../../models/organization';
import {LeadService} from '../../../services/lead.service';
import {OrganizationService} from '../../../services/organization.service';
import {Referral} from '../../../models/referral';
import {FacilityRoom} from '../../../../residents/models/facility-room';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  referrer_types: ReferrerType[];

  leads: Lead[];
  organizations: Organization[];

  phone_types: { id: PhoneType, name: string }[];

  private _show_lead: boolean = true;

  edit_data: Referral;

  get show_lead(): boolean {
    return this._show_lead;
  }

  set show_lead(value: boolean) {
    this._show_lead = value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private lead$: LeadService,
    private organization$: OrganizationService,
    private referrer_type$: ReferrerTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      lead_id: [null, Validators.compose([Validators.required])],
      type_id: [null, Validators.compose([Validators.required])],

      organization_id: [null, Validators.compose([Validators.required])],

      first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      emails: [[], Validators.compose([Validators.required])],
      phones: this.formBuilder.array([]),

    });

    this.form.get('organization_id').disable();

    this.form.get('first_name').disable();
    this.form.get('last_name').disable();
    this.form.get('notes').disable();
    this.form.get('emails').disable();
    this.form.get('phones').disable();

    this.phone_types = [
      {id: PhoneType.HOME, name: 'HOME'},
      {id: PhoneType.MOBILE, name: 'MOBILE'},
      {id: PhoneType.WORK, name: 'WORK'},
      {id: PhoneType.OFFICE, name: 'OFFICE'},
      {id: PhoneType.EMERGENCY, name: 'EMERGENCY'},
      {id: PhoneType.FAX, name: 'FAX'},
      {id: PhoneType.ROOM, name: 'ROOM'}
    ];

    this.subscribe('list_lead');
    this.subscribe('list_organization');
    this.subscribe('list_referrer_type');
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'phones':
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
      case 'list_referrer_type':
        this.$subscriptions[key] = this.referrer_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.referrer_types = res;

            if (params) {
              this.form.get('type_id').setValue(params.type_id);
            }

            this.subscribe('vc_referrer_type');
            this.form.get('type_id').setValue(this.form.get('type_id').value);
          }
        });
        break;
      case 'list_lead':
        this.$subscriptions[key] = this.lead$.all([{key: 'free', value: '1'}]).pipe(first()).subscribe(res => {
          if (res) {
            this.leads = res;

            if (this.edit_mode && this.edit_data.lead !== null) {
              const leads = this.leads.filter(v => v.id === this.edit_data.lead.id);

              if (leads.length === 0) {
                this.leads.push(this.edit_data.lead);
              }
            }

            if (params) {
              this.form.get('lead_id').setValue(params.lead_id);
            }
          }
        });
        break;
      case 'list_organization':
        this.$subscriptions[key] = this.organization$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.organizations = res;

            if (params) {
              this.form.get('organization_id').setValue(params.organization_id);
            }
          }
        });
        break;
      case 'vc_referrer_type':
        this.$subscriptions[key] = this.form.get('type_id').valueChanges.subscribe(next => {
          if (next) {
            const type = this.referrer_types.filter(v => v.id === next).pop();

            if (type) {
              if (type.organization_required) {
                this.form.get('organization_id').enable();
              } else {
                this.form.get('organization_id').disable();
              }

              if (type.representative_required) {
                this.form.get('first_name').enable();
                this.form.get('last_name').enable();
                this.form.get('notes').enable();
                this.form.get('emails').enable();
                this.form.get('phones').enable();
              } else {
                this.form.get('first_name').disable();
                this.form.get('last_name').disable();
                this.form.get('notes').disable();
                this.form.get('emails').disable();
                this.form.get('phones').disable();
              }
            } else {
              this.form.get('organization_id').disable();

              this.form.get('first_name').disable();
              this.form.get('last_name').disable();
              this.form.get('notes').disable();
              this.form.get('emails').disable();
              this.form.get('phones').disable();
            }
          }
        });
        break;
      default:
        break;
    }
  }


  before_set_form_data(data: any): void {
    if (data !== null) {
      this.edit_data = _.cloneDeep(data);
    }
  }
}
