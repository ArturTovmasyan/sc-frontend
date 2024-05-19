import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {ReferrerType} from '../../../models/referrer-type';
import {ReferrerTypeService} from '../../../services/referrer-type.service';
import {Lead} from '../../../models/lead';
import {Organization} from '../../../models/organization';
import {LeadService} from '../../../services/lead.service';
import {OrganizationService} from '../../../services/organization.service';
import {Referral} from '../../../models/referral';
import {ContactService} from '../../../services/contact.service';
import {Contact} from '../../../models/contact';
import {FormComponent as OrganizationFormComponent} from '../../organization/form/form.component';
import {FormComponent as ContactFormComponent} from '../../contact/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as ReferrerTypeFormComponent} from '../../referrer-type/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  referrer_types: ReferrerType[];

  leads: Lead[];
  organizations: Organization[];
  contacts: Contact[];
  edit_data: Referral;

  private _show_lead: boolean = true;

  get show_lead(): boolean {
    return this._show_lead;
  }

  set show_lead(value: boolean) {
    this._show_lead = value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private modal$: NzModalService,
    private lead$: LeadService,
    private organization$: OrganizationService,
    private referrer_type$: ReferrerTypeService,
    private contact$: ContactService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      lead_id: [null, Validators.compose([Validators.required])],
      type_id: [null, Validators.compose([Validators.required])],

      organization_id: [null, Validators.compose([Validators.required])],
      contact_id: [null, Validators.compose([Validators.required])],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

    });

    this.form.get('organization_id').disable();
    this.form.get('contact_id').disable();
    this.form.get('notes').disable();

    this.subscribe('list_lead');
    this.subscribe('list_contact');
    this.subscribe('list_organization');
    this.subscribe('list_referrer_type');
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
      case 'list_contact':
        this.$subscriptions[key] = this.contact$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.contacts = res;

            if (params) {
              this.form.get('contact_id').setValue(params.contact_id);
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
                this.form.get('contact_id').enable();
                this.form.get('notes').enable();
              } else {
                this.form.get('contact_id').disable();
                this.form.get('notes').disable();
              }
            } else {
              this.form.get('organization_id').disable();

              this.form.get('contact_id').disable();
              this.form.get('notes').disable();
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
      case 'contact':
        this.create_modal(
          this.modal$,
          ContactFormComponent,
          data => this.contact$.add(data),
          data => {
            this.subscribe('list_contact', {contact_id: data[0]});
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
    }
  }
}
