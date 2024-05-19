import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {MedicalHistoryCondition} from '../../../../../models/medical-history-condition';
import {MedicalHistoryConditionService} from '../../../../../services/medical-history-condition.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  sub_form_enabled: boolean = false;

  conditions: MedicalHistoryCondition[];
  resident_id: number;

  constructor(private formBuilder: FormBuilder, private condition$: MedicalHistoryConditionService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.max(512)])],

      date_occured: [new Date(), Validators.required],

      condition_id: [null, Validators.required],

      condition: this.formBuilder.group({
        title: ['', Validators.compose([Validators.required, Validators.max(200)])],
        description: ['', Validators.compose([Validators.max(255)])],
      }),

      resident_id: [this.resident_id, Validators.required]
    });

    this.toggle_sub_form();

    this.condition$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.conditions = res;
      }
    });
  }

  toggle_sub_form() {
    if (this.sub_form_enabled) {
      this.form.get('condition').enable();
      this.form.get('condition_id').disable();
    } else {
      this.form.get('condition_id').enable();
      this.form.get('condition').disable();
    }

    this.sub_form_enabled = !this.sub_form_enabled;
  }

}
