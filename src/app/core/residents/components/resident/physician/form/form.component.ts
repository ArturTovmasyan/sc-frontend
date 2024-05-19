import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  physicians: Physician[];
  resident_id: number;

  constructor(private formBuilder: FormBuilder, private physician$: PhysicianService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      physician_id: [null, Validators.required],
      primary: [false, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.physician$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
      if (res) {
        this.physicians = res;
      }
    });
  }

}
