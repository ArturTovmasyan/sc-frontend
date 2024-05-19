import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Diet} from '../../../../models/diet';
import {DietService} from '../../../../services/diet.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  diets: Diet[];
  resident_id: number;

  constructor(private formBuilder: FormBuilder, private diet$: DietService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      description: ['', Validators.compose([Validators.required, Validators.max(512)])],
      diet_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.diet$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.diets = res;
      }
    });
  }

}
