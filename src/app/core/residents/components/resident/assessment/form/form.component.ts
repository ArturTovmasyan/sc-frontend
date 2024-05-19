import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {AssessmentForm} from '../../../../models/assessment-form';
import {AssessmentFormService} from '../../../../services/assessment-form.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  assessment_forms: AssessmentForm[];

  resident_id: number;

  tab_selected: number;
  tab_data_disabled: boolean;

  constructor(private formBuilder: FormBuilder,
              private assessment_form$: AssessmentFormService,
              private route$: ActivatedRoute,
              private _el: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review
    this.tab_selected = 0;
    this.tab_data_disabled = true;

    this.form = this.formBuilder.group({
      id: [''],

      // Tab 1

      assessment_form_id: [null, Validators.required],
      date: [new Date(), Validators.required],
      performed_by: ['', Validators.required],
      notes: ['', Validators.compose([Validators.max(512)])],


      // Tab 2
      score: [{value: 0, disabled: true}, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.assessment_form$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
      if (res) {
        this.assessment_forms = res;

        this.form.get('assessment_form_id').valueChanges.subscribe(next => {
          const assessment_form = this.assessment_forms.filter(item => item.id === this.form.get('assessment_form_id').value).pop();

          if (assessment_form) {
            this.tab_data_disabled = false;
          }
        });
      }
    });

    this.postSubmit = (data: any) => {
      const tab_el = this._el.nativeElement.querySelector(':not(form).ng-invalid').closest('.ant-tabs-tabpane');
      this.tab_selected = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
    };
  }

}
