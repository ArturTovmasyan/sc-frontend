import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../../models/space';
import {SpaceService} from '../../../../../services/space.service';
import {first} from 'rxjs/operators';
import {AssessmentCareLevelGroup} from '../../../../models/assessment-care-level-group';
import {AssessmentCareLevelGroupService} from '../../../../services/assessment-care-level-group.service';
import {AssessmentCategory} from '../../../../models/assessment-category';
import {AssessmentCategoryService} from '../../../../services/assessment-category.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  category_selector: number = null;

  categories: AssessmentCategory[];
  care_level_groups: AssessmentCareLevelGroup[];
  spaces: Space[];

  constructor
  (private formBuilder: FormBuilder,
   private category$: AssessmentCategoryService,
   private care_level_group$: AssessmentCareLevelGroupService,
   private space$: SpaceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],

      care_level_groups: [null, Validators.required],

      categories:  this.formBuilder.array([]),

      space_id: [null, Validators.required],
    });

    this.category$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.title.localeCompare(b.title));
        this.categories = res;

        this.after_set_form_data();
      }
    });

    this.care_level_group$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.title.localeCompare(b.title));
        this.care_level_groups = res;
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });
  }

  public get_title(idx: number) {
    const control = this.get_form_array('categories').controls[idx];

    let category = null;

    if (control && this.categories) {
      category = this.categories.filter(item => item.id === control.value).pop();
    }

    return category ? category.title : '';
  }

  add_category() {
    const category = this.categories.filter(item => item.id === this.category_selector).pop();
    if (category) {
      category.disabled = true;

      this.add_field('categories', category.id);

      this.category_selector = null;
    }
  }

  remove_category(i: number) {
    const control = this.get_form_array('categories').controls[i];

    if (control) {
      const category = this.categories.filter(item => item.id === control.value).pop();
      category.disabled = false;
      this.remove_field('categories', i);
    }
  }

  public get_form_array_skeleton(key: string): FormGroup| FormControl {
    switch (key) {
      case 'categories':
        return new FormControl();
      default:
        return null;
    }
  }

  public before_submit(): void {
    const rows: FormArray = this.get_form_array('categories');
    const rows_copy = [];

    for (const row of rows.controls) {
      rows_copy.push(row.value);
    }
    rows.reset(rows_copy);
  }

  public after_set_form_data(): void {
    const controls = this.get_form_array('categories').controls;

    if (controls && this.categories) {
      Object.keys(controls).forEach(idx => {
        // console.log(controls[idx].value);
        // console.log(this.categories);
        const category = this.categories.filter(item => item.id === controls[idx].value).pop();
        category.disabled = true;
      });
    }
  }
}
