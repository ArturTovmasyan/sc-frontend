import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Diet} from '../../../../models/diet';
import {DietService} from '../../../../services/diet.service';
import {ActivatedRoute} from '@angular/router';
import {FormComponent as DietFormComponent} from '../../../diet/form/form.component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  diets: Diet[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private diet$: DietService,
    private route$: ActivatedRoute,
    private modal$: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(512)])],
      diet_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.subscribe('list_diet');
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_diet':
        this.$subscriptions[key] = this.diet$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.diets = res;
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
            this.$subscriptions[key] = this.diet$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.diets = res;
                this.form.get('diet_id').setValue(data[0]);
              }
            });
            return null;
          });
        break;
      default:
        break;
    }
  }

}
