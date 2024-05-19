import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {MedicalHistoryCondition} from '../../../../../models/medical-history-condition';
import {MedicalHistoryConditionService} from '../../../../../services/medical-history-condition.service';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {FormComponent as MedicalHistoryConditionFormComponent} from '../../../../medical-history-condition/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  conditions: MedicalHistoryCondition[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private condition$: MedicalHistoryConditionService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'condition', component: MedicalHistoryConditionFormComponent}
    ];
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

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      data.date = DateHelper.convertUTC(data.date);
    }
  }

}
