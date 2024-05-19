﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Diagnosis} from '../../../../../models/diagnosis';
import {DiagnosisService} from '../../../../../services/diagnosis.service';
import {DiagnoseType} from '../../../../../models/diagnose-type.enum';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as DiagnosisFormComponent} from '../../../../diagnosis/form/form.component';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  types: { id: DiagnoseType, name: string }[];

  diagnoses: Diagnosis[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private diagnosis$: DiagnosisService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      type: ['', Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      diagnosis_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_diagnosis');

    // TODO: review
    this.types = [
      {id: DiagnoseType.PRIMARY, name: 'Primary'},
      {id: DiagnoseType.SECONDARY, name: 'Secondary'},
      {id: DiagnoseType.OTHER, name: 'Other'}
    ];
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_diagnosis':
        this.$subscriptions[key] = this.diagnosis$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.diagnoses = res;

            if (params) {
              this.form.get('diagnosis_id').setValue(params.diagnosis_id);
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
      case 'diagnosis':
        this.create_modal(
          this.modal$,
          DiagnosisFormComponent,
          data => this.diagnosis$.add(data),
          data => {
            this.subscribe('list_diagnosis', {diagnosis_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

}
