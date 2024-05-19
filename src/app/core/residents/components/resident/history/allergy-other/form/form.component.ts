import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Allergen} from '../../../../../models/allergen';
import {AllergenService} from '../../../../../services/allergen.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'form.component.html',
  styleUrls: ['../../history.component.scss']
})
export class FormComponent extends AbstractForm implements OnInit {
  sub_form_enabled: boolean = false;

  allergens: Allergen[];
  resident_id: number;

  constructor(private formBuilder: FormBuilder, private allergen$: AllergenService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.max(512)])],

      allergen_id: [null, Validators.required],

      allergen: this.formBuilder.group({
        title: ['', Validators.compose([Validators.required, Validators.max(200)])],
        description: ['', Validators.compose([Validators.max(255)])],
      }),

      resident_id: [this.resident_id, Validators.required]
    });

    this.toggle_sub_form();

    this.allergen$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.allergens = res;
      }
    });
  }

  toggle_sub_form() {
    if (this.sub_form_enabled) {
      this.form.get('allergen').enable();
      this.form.get('allergen_id').disable();
    } else {
      this.form.get('allergen_id').enable();
      this.form.get('allergen').disable();
    }

    this.sub_form_enabled = !this.sub_form_enabled;
  }

}
