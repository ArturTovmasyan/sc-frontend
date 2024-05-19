import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Medication} from '../../../../../models/medication';
import {MedicationService} from '../../../../../services/medication.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'form.component.html',
  styleUrls: ['../../history.component.scss']
})
export class FormComponent extends AbstractForm implements OnInit {
  sub_form_enabled: boolean = false;

  medications: Medication[];
  resident_id: number;

  constructor(private formBuilder: FormBuilder, private medication$: MedicationService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.max(512)])],

      medication_id: [null, Validators.required],

      medication: this.formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.max(200)])],
      }),

      resident_id: [this.resident_id, Validators.required]
    });

    this.toggle_sub_form();

    this.medication$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.medications = res;
      }
    });
  }

  toggle_sub_form() {
    if (this.sub_form_enabled) {
      this.form.get('medication').enable();
      this.form.get('medication_id').disable();
    } else {
      this.form.get('medication_id').enable();
      this.form.get('medication').disable();
    }

    this.sub_form_enabled = !this.sub_form_enabled;
  }

}
