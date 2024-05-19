import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Diet} from '../../../../models/diet';
import {DietService} from '../../../../services/diet.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {FormComponent as DietFormComponent} from '../../../diet/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  diets: Diet[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private diet$: DietService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'diet', component: DietFormComponent}
    ];
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

}
