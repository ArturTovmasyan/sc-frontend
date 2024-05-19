import {Component, ElementRef, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {AssessmentForm} from '../../../../models/assessment-form';
import {AssessmentFormService} from '../../../../services/assessment-form.service';
import {ActivatedRoute} from '@angular/router';
import {AssessmentCategory} from '../../../../models/assessment-category';

@Component({
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss']
})
export class FormComponent extends AbstractForm implements OnInit {
  assessment_forms: AssessmentForm[];

  resident_id: number;

  tab_selected: number;
  tab_data_disabled: boolean;

  categories: AssessmentCategory[];

  category_selected;

  rows: number[];

  private static calc_multi_item(count: number): number {
    let total = 0;

    if (count < 3) {
      total = 2 - count;
    } else if (count > 2 && count <= 4) {
      total = 2 - count;
    } else if (count > 4 && count <= 7) {
      total = 1 - count;
    } else if (count > 7 && count <= 10) {
      total = 0 - count;
    }

    return total;
  }

  constructor(private formBuilder: FormBuilder,
              private assessment_form$: AssessmentFormService,
              private route$: ActivatedRoute,
              private _el: ElementRef) {
    super();

    this.loaded.next(false);
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review
    this.tab_selected = 0;
    this.tab_data_disabled = true;

    this.category_selected = 0;
    this.categories = [];

    this.form = this.formBuilder.group({
      id: [''],

      // Tab 1

      form_id: [null, Validators.required],
      date: [new Date(), Validators.required],
      performed_by: ['', Validators.required],
      notes: ['', Validators.compose([Validators.maxLength(512)])],


      // Tab 2
      score: [{value: 0, disabled: true}, Validators.required],

      rows: this.formBuilder.array([], Validators.required),

      resident_id: [this.resident_id, Validators.required]
    });

    this.assessment_form$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
      if (res) {
        this.assessment_forms = res;

        this.form.get('form_id').valueChanges.subscribe(next => {
          const assessment_form = this.assessment_forms.filter(item => item.id === this.form.get('form_id').value).pop();

          if (assessment_form) {
            this.rows = [];
            this.category_selected = 0;
            this.tab_data_disabled = false;

            this.categories = assessment_form.categories;

            this.categories.forEach(category => {
              if (category.multi_item) {
                const rows_group = [];
                category.rows.forEach(row => {
                  rows_group.push({label: row.title, value: row.id, checked: false});
                });

                category.check_group = rows_group;
              } else {
                category.row = 0;
              }
            });
          }
        });

        this.loaded.next(true);
      }
    });

    this.postSubmit = (data: any) => {
      const tab_el = this._el.nativeElement.querySelector(':not(form).ng-invalid').closest('.ant-tabs-tabpane');
      this.tab_selected = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
    };
  }

  pre(): void {
    this.category_selected -= 1;
    // console.log(this.categories);
  }

  next(): void {
    this.category_selected += 1;
    // console.log(this.categories);
  }

  calculate_score_and_rows() {
    let score = [];
    let rows = [];

    // this.form.get('score');

    this.categories.forEach(v => {
      if (v.multi_item) {
        const selected_rows = v.check_group.filter(r => r.checked);
        const selected_ids = selected_rows.map(r => r.value);

        rows.push(...selected_ids);
        score.push(FormComponent.calc_multi_item(selected_rows.length));
      } else {
        const selected_ids = [v.row];
        const selected_rows = v.rows.filter(r => r.id === selected_ids[0]);

        rows.push(...selected_ids);
        score.push(selected_rows.map(r => r.score)[0]);
      }
    });
    rows = Array.from(new Set(rows));
    score = score.reduce((previous, value) => (previous + value), 0);

    this.form.setControl('rows', this.formBuilder.array([]));

    rows.forEach(value => {
      (<FormArray>this.form.get('rows')).push(new FormControl(value));
    });

    this.form.get('score').setValue(score);
  }

  public get_form_array_skeleton(key: string): FormGroup | FormControl {
    switch (key) {
      case 'rows':
        return new FormControl();
      default:
        return null;
    }
  }

  public after_set_form_data(): void {
    const rows = <Array<number>>this.form.get('rows').value;

    this.categories.forEach(category => {
      if (category.multi_item) {
        category.check_group.filter(check => rows.includes(check.value)).forEach(check => check.checked = true);
      } else {
        category.rows.filter(row => rows.includes(row.id)).forEach(row => category.row = row.id);
      }
    });
  }
}
