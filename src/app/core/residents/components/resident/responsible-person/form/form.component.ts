import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Relationship} from '../../../../models/relationship';
import {ResponsiblePerson} from '../../../../models/responsible-person';
import {ResponsiblePersonService} from '../../../../services/responsible-person.service';
import {RelationshipService} from '../../../../services/relationship.service';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as RelationshipFormComponent} from '../../../relationship/form/form.component';
import {FormComponent as ResponsiblePersonFormComponent} from '../../../responsible-person/form/form.component';
import {FormComponent as ResponsiblePersonRoleFormComponent} from '../../../responsible-person-role/form/form.component';
import {ResponsiblePersonRole} from '../../../../models/responsible-person-role';
import {ResponsiblePersonRoleService} from '../../../../services/responsible-person-role.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  relationships: Relationship[];
  roles: ResponsiblePersonRole[];
  responsible_persons: ResponsiblePerson[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private relationship$: RelationshipService,
    private responsible_person_role$: ResponsiblePersonRoleService,
    private responsible_person$: ResponsiblePersonService,
    private modal$: NzModalService,
    private route$: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],

      responsible_person_id: [null, Validators.required],
      relationship_id: [null, Validators.required],
      role_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.subscribe('list_relationship');
    this.subscribe('list_role');
    this.subscribe('list_responsible_person');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_relationship':
        this.$subscriptions[key] = this.relationship$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
          if (res) {
            this.relationships = res;

            if (params) {
              this.form.get('relationship_id').setValue(params.relationship_id);
            }
          }
        });
        break;
      case 'list_role':
        this.$subscriptions[key] = this.responsible_person_role$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
          if (res) {
            this.roles = res;

            if (params) {
              this.form.get('role_id').setValue(params.role_id);
            }
          }
        });
        break;
      case 'list_responsible_person':
        this.$subscriptions[key] = this.responsible_person$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.responsible_persons = res;

            if (params) {
              this.form.get('responsible_person_id').setValue(params.responsible_person_id);
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
      case 'responsible_person':
        this.create_modal(
          this.modal$,
          ResponsiblePersonFormComponent,
          data => this.responsible_person$.add(data),
          data => {
            this.subscribe('list_responsible_person', {responsible_person_id: data[0]});
            return null;
          });
        break;
      case 'relationship':
        this.create_modal(
          this.modal$,
          RelationshipFormComponent,
          data => this.relationship$.add(data),
          data => {
            this.subscribe('list_relationship', {relationship_id: data[0]});
            return null;
          });
        break;
      case 'role':
        this.create_modal(
          this.modal$,
          ResponsiblePersonRoleFormComponent,
          data => this.responsible_person_role$.add(data),
          data => {
            this.subscribe('list_role', {role_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }
}
