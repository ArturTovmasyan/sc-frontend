import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Diet} from '../../../../models/diet';
import {DietService} from '../../../../services/diet.service';
import {FormComponent as DietFormComponent} from '../../../diet/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  diets: Diet[];

  constructor(
    private formBuilder: FormBuilder,
    private diet$: DietService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      description: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(512)])],
      diet_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_diet');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_diet':
        this.$subscriptions[key] = this.diet$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.diets = res;

            if (params) {
              this.form.get('diet_id').setValue(params.diet_id);
            }
          }
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

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'diet':
        this.create_modal(
          this.modal$,
          DietFormComponent,
          data => this.diet$.add(data),
          data => {
            this.subscribe('list_diet', {diet_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

}
