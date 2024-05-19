import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Medication} from '../../../../../models/medication';
import {MedicationService} from '../../../../../services/medication.service';
import {FormComponent as MedicationFormComponent} from '../../../../medication/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  medications: Medication[];

  constructor(
    private formBuilder: FormBuilder,
    private medication$: MedicationService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      medication_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_medication');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_medication':
        this.$subscriptions[key] = this.medication$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.medications = res;

            if (params) {
              this.form.get('medication_id').setValue(params.medication_id);
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
      case 'medication':
        this.create_modal(
          this.modal$,
          MedicationFormComponent,
          data => this.medication$.add(data),
          data => {
            this.subscribe('list_medication', {medication_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }
}
