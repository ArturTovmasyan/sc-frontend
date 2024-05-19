import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Relationship} from '../../../../models/relationship';
import {ResponsiblePerson} from '../../../../models/responsible-person';
import {ResponsiblePersonService} from '../../../../services/responsible-person.service';
import {RelationshipService} from '../../../../services/relationship.service';
import {ActivatedRoute} from '@angular/router';

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
    private route$: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      relationship_id: [null, Validators.required],
      responsible_person_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.relationship$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
      if (res) {
        this.relationships = res;
      }
    });

    this.responsible_person$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.responsible_persons = res;
      }
    });
  }

}
