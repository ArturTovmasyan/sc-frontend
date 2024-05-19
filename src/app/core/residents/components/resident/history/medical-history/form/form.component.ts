import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {MedicalHistoryCondition} from '../../../../../models/medical-history-condition';
import {MedicalHistoryConditionService} from '../../../../../services/medical-history-condition.service';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as MedicationHistoryConditionFormComponent} from '../../../../medical-history-condition/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  conditions: MedicalHistoryCondition[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private condition$: MedicalHistoryConditionService,
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

      date: [new Date(), Validators.required],

      condition_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.subscribe('list_condition');
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_condition':
        this.$subscriptions[key] = this.condition$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.conditions = res;
          }
        });
        break;
      default:
        break;
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'condition':
        this.create_modal(
          this.modal$,
          MedicationHistoryConditionFormComponent,
          data => this.condition$.add(data),
          data => {
            this.$subscriptions[key] = this.condition$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.conditions = res;
                this.form.get('condition_id').setValue(data[0]);
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
