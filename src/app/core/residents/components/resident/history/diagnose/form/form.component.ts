import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Diagnosis} from '../../../../../models/diagnosis';
import {DiagnosisService} from '../../../../../services/diagnosis.service';
import {ActivatedRoute} from '@angular/router';
import {DiagnoseType} from '../../../../../models/diagnose-type.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  sub_form_enabled: boolean = false;

  types: { id: DiagnoseType, name: string }[];

  diagnoses: Diagnosis[];
  resident_id: number;

  constructor(private formBuilder: FormBuilder, private diagnosis$: DiagnosisService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      type: ['', Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.max(512)])],

      diagnose_id: [null, Validators.required],

      diagnose: this.formBuilder.group({
        title: ['', Validators.compose([Validators.required, Validators.max(200)])],
        acronym: ['', Validators.compose([Validators.max(20)])],
        description: ['', Validators.compose([Validators.max(255)])],
      }),

      resident_id: [this.resident_id, Validators.required]
    });

    this.toggle_sub_form();

    this.diagnosis$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.diagnoses = res;
      }
    });

    this.types = [
      {id: DiagnoseType.PRIMARY, name: 'Primary'},
      {id: DiagnoseType.SECONDARY, name: 'Secondary'},
      {id: DiagnoseType.OTHER, name: 'Other'}
    ];
  }

  toggle_sub_form() {
    if (this.sub_form_enabled) {
      this.form.get('diagnose').enable();
      this.form.get('diagnose_id').disable();
    } else {
      this.form.get('diagnose_id').enable();
      this.form.get('diagnose').disable();
    }

    this.sub_form_enabled = !this.sub_form_enabled;
  }

}
