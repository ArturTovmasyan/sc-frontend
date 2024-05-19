import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {MedicalHistoryCondition} from '../../../../../models/medical-history-condition';
import {MedicalHistoryConditionService} from '../../../../../services/medical-history-condition.service';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as MedicationHistoryConditionFormComponent} from '../../../../medical-history-condition/form/form.component';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  conditions: MedicalHistoryCondition[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private condition$: MedicalHistoryConditionService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      date: [new Date(), Validators.required],

      condition_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_condition');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_condition':
        this.$subscriptions[key] = this.condition$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.conditions = res;

            if (params) {
              this.form.get('condition_id').setValue(params.condition_id);
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
      case 'condition':
        this.create_modal(
          this.modal$,
          MedicationHistoryConditionFormComponent,
          data => this.condition$.add(data),
          data => {
            this.subscribe('list_condition', {condition_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

}
