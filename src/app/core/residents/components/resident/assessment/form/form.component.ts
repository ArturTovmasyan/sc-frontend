import * as _ from 'lodash';
import {Component, ElementRef, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {AssessmentForm} from '../../../../models/assessment-form';
import {AssessmentFormService} from '../../../../services/assessment-form.service';
import {AssessmentCategory} from '../../../../models/assessment-category';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss']
})
export class FormComponent extends AbstractForm implements OnInit {
  assessment_forms: AssessmentForm[];

  tab_selected: number;
  tab_data_disabled: boolean;

  categories: AssessmentCategory[];

  category_selected;

  rows: number[];

  data_loaded: boolean = false;

  private static calc_multi_item(count: number): number {
    let total = 0;

    if (count <= 2) {
      total = 2;
    } else if (count > 2 && count <= 4) {
      total = 2;
    } else if (count > 4 && count <= 7) {
      total = 1;
    } else if (count > 7 && count <= 10) {
      total = 0;
    }

    return total;
  }

  private calculate_score(rows: Array<any>) {
    const score = [];

    this.categories.forEach((c, idx) => {
      if (c.multi_item) {
        if (rows[idx] && _.isArray(rows[idx])) {
          score.push(FormComponent.calc_multi_item(rows[idx].length));
        } else {
          score.push(FormComponent.calc_multi_item(0));
        }
      } else {
        if (rows[idx]) {
          const row = c.rows.filter(r => r.id === rows[idx]).pop();
          score.push(row.score);
        } else {
          score.push(0);
        }
      }
    });

    return score.reduce((previous, value) => (previous + value), 0);
  }

  constructor(private formBuilder: FormBuilder,
              private assessment_form$: AssessmentFormService,
              private residentSelector$: ResidentSelectorService,
              private _el: ElementRef) {
    super();

    this.loaded.next(false);
  }

  ngOnInit(): void {
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

      resident_id: [null, Validators.required]
    });

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.tab_selected = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };

    this.subscribe('rs_resident');
    this.subscribe('list_assessment_form');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_assessment_form':
        this.$subscriptions[key] = this.assessment_form$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
          if (res) {
            this.assessment_forms = res;

            this.subscribe('vc_form_id');

            this.loaded.next(true);
          }
        });
        break;
      case 'vc_form_id':
        this.$subscriptions[key] = this.form.get('form_id').valueChanges.subscribe(next => {
          this.form.get('score').setValue(0);

          const assessment_form = this.assessment_forms.filter(item => item.id === this.form.get('form_id').value).pop();

          if (assessment_form) {
            this.rows = [];
            this.category_selected = 0;

            this.categories = assessment_form.categories;

            const rows_controls: (FormControl | FormArray)[] = [];

            this.categories.forEach(category => {
              if (category.multi_item) {
                const rows_group = [];
                category.rows.forEach(row => {
                  rows_group.push({label: row.title, value: row.id, checked: false});
                });

                category.check_group = rows_group;
                rows_controls.push(new FormControl(null, Validators.required));
              } else {
                category.row = 0;

                rows_controls.push(new FormControl(null, Validators.required));
              }
            });

            if (!this.edit_mode || (this.edit_mode && this.data_loaded)) {
              this.form.setControl('rows', new FormArray(rows_controls));
              this.subscribe('vc_rows');
              this.form.get('rows').setValue(this.form.get('rows').value);
            }

            this.tab_data_disabled = false;
          }
        });
        break;
      case 'vc_rows':
        this.$subscriptions[key] = (<FormArray>this.form.get('rows')).valueChanges.subscribe(next => {
          this.form.get('score').setValue(this.calculate_score(next));
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
          }
        });
        break;
      default:
        break;
    }
  }

  pre(): void {
    this.category_selected -= 1;
  }

  next(): void {
    this.category_selected += 1;
  }

  update_multi_rows(i: number) {
    this.form.get(`rows.${i}`).setValue(this.categories[i].check_group.filter(v => v.checked).map(v => v.value));
  }

  public get_form_array_skeleton(key: string): FormControl {
    switch (key) {
      case 'rows':
        return new FormControl();
      default:
        return null;
    }
  }

  public after_set_form_data(): void {
    const rows = <Array<any>>this.form.get('rows').value;

    rows.forEach(row => {
      if (_.isArray(row)) {
        this.categories.filter(c => c.multi_item).forEach(category => {
          category.check_group.filter(check => row.includes(check.value)).forEach(check => check.checked = true);
        });
      }
    });

    this.form.get('score').setValue(this.calculate_score(rows));
    this.subscribe('vc_rows');

    this.data_loaded = true;
  }

  rows_controls() {
    return (<FormArray>this.form.get('rows')).controls;
  }

}
