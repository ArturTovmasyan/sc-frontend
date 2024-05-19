import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Allergen} from '../../../../../models/allergen';
import {AllergenService} from '../../../../../services/allergen.service';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as AllergenFormComponent} from '../../../../allergen/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  allergens: Allergen[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private allergen$: AllergenService,
    private route$: ActivatedRoute,
    private modal$: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      allergen_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

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
