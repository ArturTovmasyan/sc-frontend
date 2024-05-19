import * as _ from 'lodash';
import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first, pairwise} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Medication} from '../../../../models/medication';
import {MedicationService} from '../../../../services/medication.service';
import {MedicationFormFactor} from '../../../../models/medication-form-factor';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {MedicationFormFactorService} from '../../../../services/medication-form-factor.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {FormComponent as MedicationFormComponent} from '../../../medication/form/form.component';
import {FormComponent as MedicationFormFactorFormComponent} from '../../../medication-form-factor/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as PhysicianFormComponent} from '../../../physician/form/form.component';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ResidentMedicationService} from '../../../../services/resident-medication.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  form_factors: MedicationFormFactor[];
  medications: Medication[];
  physicians: Physician[];
  selectedTab: number;

  constructor(
    private formBuilder: FormBuilder,
    private _el: ElementRef,
    private medication$: MedicationService,
    private residentMedication$: ResidentMedicationService,
    private form_factor$: MedicationFormFactorService,
    private physician$: PhysicianService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedTab = 0;

    this.form = this.formBuilder.group({
      id: [''],

      // Tab 1

      medication_id: [null, Validators.required],
      form_factor_id: [null, Validators.required],

      dosage: ['', Validators.compose([Validators.required, Validators.maxLength(10), CoreValidator.dosage])],
      dosage_unit: ['', Validators.compose([Validators.required, Validators.maxLength(100), CoreValidator.dosage_unit])],

      physician_id: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      prescription_number: ['', Validators.compose([Validators.maxLength(40)])],

      // Tab 2

      am: ['0', Validators.compose([Validators.maxLength(10)])],
      nn: ['0', Validators.compose([Validators.maxLength(10)])],
      pm: ['0', Validators.compose([Validators.maxLength(10)])],
      hs: ['0', Validators.compose([Validators.maxLength(10)])],

      prn: [false, Validators.required],
      discontinued: [false, Validators.required],
      treatment: [false, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };

    this.subscribe('vc_medication_id');
    this.subscribe('rs_resident');
    this.subscribe('list_medication');
    this.subscribe('list_form_factor');
    this.subscribe('list_physician');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'vc_medication_id':
        this.$subscriptions[key] = this.form.get('medication_id').valueChanges.pipe(pairwise())
          .subscribe(([prev, next]: [any, any]) => {
            if (next) {
              if (!this.edit_mode) {
                this.residentMedication$.all([
                  {key: 'resident_id', value: this.form.get('resident_id').value},
                  {key: 'medication_id', value: next}
                ]).subscribe(res => {
                  if (_.isArray(res) && res.length > 0) {
                    this.show_medication_confirm(prev);
                  }
                });
              }
            }
          });
        break;
      case 'list_medication':
        this.$subscriptions[key] = this.medication$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.medications = res;

            if (params) {
              this.form.get('medication_id').setValue(params.medication_id);
            } else {
              this.form.get('medication_id').setValue(this.form.get('medication_id').value);
            }
          }
        });
        break;
      case 'list_form_factor':
        this.$subscriptions[key] = this.form_factor$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.form_factors = res;

            if (params) {
              this.form.get('form_factor_id').setValue(params.form_factor_id);
            }
          }
        });
        break;
      case 'list_physician':
        this.$subscriptions[key] = this.physician$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.physicians = res;

            if (params) {
              this.form.get('physician_id').setValue(params.physician_id);
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
      case 'form_factor':
        this.create_modal(
          this.modal$,
          MedicationFormFactorFormComponent,
          data => this.form_factor$.add(data),
          data => {
            this.subscribe('list_form_factor', {form_factor_id: data[0]});
            return null;
          });
        break;
      case 'physician':
        this.create_modal(
          this.modal$,
          PhysicianFormComponent,
          data => this.physician$.add(data),
          data => {
            this.subscribe('list_physician', {physician_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

  show_medication_confirm(prev: any): void {
    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: `<p class="modal-confirm text-center">
      <i class="fa fa-info text-info"></i> This medication already added for this resident.<br/>
      Are you sure to add one more?</p>`,
      nzFooter: [
        {
          label: 'No',
          onClick: () => {
            this.form.get('medication_id').setValue(prev);
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Yes',
          onClick: () => {
            modal.close();
          }
        }
      ]
    });
  }
}
