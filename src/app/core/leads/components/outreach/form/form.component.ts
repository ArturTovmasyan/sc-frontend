import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {OutreachType} from '../../../models/outreach-type';
import {OutreachTypeService} from '../../../services/outreach-type.service';
import {Organization} from '../../../models/organization';
import {OrganizationService} from '../../../services/organization.service';
import {ContactService} from '../../../services/contact.service';
import {Contact} from '../../../models/contact';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {User} from '../../../../models/user';
import {UserService} from '../../../../admin/services/user.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as OutreachTypeFormComponent} from '../../outreach-type/form/form.component';
import {FormComponent as OrganizationFormComponent} from '../../organization/form/form.component';
import {FormComponent as LeadContactFormComponent} from '../../contact/form/form.component';
import {AuthGuard} from '../../../../guards/auth.guard';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  outreach_types: OutreachType[];
  organizations: Organization[];
  contacts: Contact[];
  users: User[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private organization$: OrganizationService,
    private outreach_type$: OutreachTypeService,
    private contact$: ContactService,
    private user$: UserService,
    private auth_$: AuthGuard
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'outreach_type', component: OutreachTypeFormComponent},
         {key: 'organization', component: OrganizationFormComponent},
         {key: 'contact', component: LeadContactFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      date: [DateHelper.newDate(), Validators.compose([Validators.required])],
      type_id: [null, Validators.compose([Validators.required])],

      participants: [[], Validators.compose([Validators.required])],
      contacts: [[], Validators.compose([Validators.required])],

      organization_id: [null, Validators.compose([])],

      notes: ['', Validators.compose([Validators.maxLength(512)])],
    });

    this.subscribe('list_outreach_type');
    this.subscribe('list_organization');
    this.subscribe('list_contact');
    this.subscribe('list_users');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_outreach_type':
        this.$subscriptions[key] = this.outreach_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.outreach_types = res;

            if (params) {
              this.form.get('type_id').setValue(params.outreach_type_id);
            } else {
              this.form.get('type_id').setValue(this.form.get('type_id').value);
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
            } else {
              this.form.get('organization_id').setValue(this.form.get('organization_id').value);
            }
          }
        });
        break;
      case 'list_contact':
        this.$subscriptions[key] = this.contact$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.contacts = res;

            if (params) {
              const contacts = _.isArray(this.form.get('contacts').value) ? this.form.get('contacts').value : [];
              contacts.push(params.contact_id);

              this.form.get('contacts').setValue(contacts);
            }
          }
        });
        break;
      case 'list_users':
        this.$subscriptions[key] = this.user$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.users = res;

            const user_id = this.auth_$.gerUserId();
            if (!this.edit_mode && user_id !== null) {
              this.form.get('participants').setValue([user_id]);
            }
          }
        });
        break;
      default:
        break;
    }
  }

  before_submit(): void {
    this.form.get('date').setValue(DateHelper.magicDate(this.form.get('date').value)); // TODO: #846 - Review date/time fields in all system
  }

}
