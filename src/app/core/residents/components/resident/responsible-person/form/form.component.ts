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
import {FormComponent as ResponsiblePersonFormComponent} from '../../../responsible-person/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  relationships: Relationship[];
  responsible_persons: ResponsiblePerson[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private relationship$: RelationshipService,
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

      resident_id: [this.resident_id, Validators.required]
    });

    this.subscribe('list_relationship');
    this.subscribe('list_responsible_person');
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_relationship':
        this.$subscriptions[key] = this.relationship$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
          if (res) {
            this.relationships = res;
          }
        });
        break;
      case 'list_responsible_person':
        this.$subscriptions[key] = this.responsible_person$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.responsible_persons = res;
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
            this.$subscriptions[key] = this.responsible_person$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.responsible_persons = res;
                this.form.get('responsible_person_id').setValue(data[0]);
              }
            });
            return null;
          });
        break;
      default:
        break;
    }
  }
}
