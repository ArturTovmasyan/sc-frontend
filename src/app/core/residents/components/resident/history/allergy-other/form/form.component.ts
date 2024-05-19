import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Allergen} from '../../../../../models/allergen';
import {AllergenService} from '../../../../../services/allergen.service';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as AllergenFormComponent} from '../../../../allergen/form/form.component';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  allergens: Allergen[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private allergen$: AllergenService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
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

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'allergen':
        this.create_modal(
          this.modal$,
          AllergenFormComponent,
          data => this.allergen$.add(data),
          data => {
            this.subscribe('list_allergen', {allergen_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

}
