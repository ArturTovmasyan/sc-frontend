import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Relationship} from '../../../../models/relationship';
import {ResponsiblePerson} from '../../../../models/responsible-person';
import {ResponsiblePersonService} from '../../../../services/responsible-person.service';
import {RelationshipService} from '../../../../services/relationship.service';
import {ResponsiblePersonRole} from '../../../../models/responsible-person-role';
import {ResponsiblePersonRoleService} from '../../../../services/responsible-person-role.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {FormComponent as ResponsiblePersonFormComponent} from '../../../responsible-person/form/form.component';
import {FormComponent as RelationshipFormComponent} from '../../../relationship/form/form.component';
import {FormComponent as ResponsiblePersonRoleFormComponent} from '../../../responsible-person-role/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  relationships: Relationship[];
  roles: ResponsiblePersonRole[];
  responsible_persons: ResponsiblePerson[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private relationship$: RelationshipService,
    private responsible_person_role$: ResponsiblePersonRoleService,
    private responsible_person$: ResponsiblePersonService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'responsible_person', component: ResponsiblePersonFormComponent},
         {key: 'relationship', component: RelationshipFormComponent},
         {key: 'responsible_person_role', component: ResponsiblePersonRoleFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      responsible_person_id: [null, Validators.required],
      relationship_id: [null, Validators.required],
      roles: [[]],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_relationship');
    this.subscribe('list_responsible_person_role');
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
      case 'list_responsible_person_role':
        this.$subscriptions[key] = this.responsible_person_role$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
          if (res) {
            this.roles = res;

            if (params) {
              const roles = _.isArray(this.form.get('roles').value) ? this.form.get('roles').value : [];
              roles.push(params.responsible_person_role_id);

              this.form.get('roles').setValue(roles);
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
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
          }
        });
        break;
      default:
        break;
    }
  }

}
