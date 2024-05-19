import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Allergen} from '../../../../../models/allergen';
import {AllergenService} from '../../../../../services/allergen.service';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {FormComponent as AllergenFormComponent} from '../../../../allergen/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  allergens: Allergen[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private allergen$: AllergenService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'allergen', component: AllergenFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      allergen_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_allergen');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_allergen':
        this.$subscriptions[key] = this.allergen$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.allergens = res;

            if (params) {
              this.form.get('allergen_id').setValue(params.allergen_id);
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
