import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Medication} from '../../../../models/medication';
import {MedicationService} from '../../../../services/medication.service';
import {ActivatedRoute} from '@angular/router';
import {MedicationFormFactor} from '../../../../models/medication-form-factor';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {MedicationFormFactorService} from '../../../../services/medication-form-factor.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {FormComponent as MedicationFormComponent} from '../../../medication/form/form.component';
import {FormComponent as MedicationFormFactorFormComponent} from '../../../medication-form-factor/form/form.component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  form_factors: MedicationFormFactor[];
  medications: Medication[];
  physicians: Physician[];
  resident_id: number;
  selectedTab: number;

  constructor(
    private formBuilder: FormBuilder,
    private medication$: MedicationService,
    private form_factor$: MedicationFormFactorService,
    private physician$: PhysicianService,
    private modal$: NzModalService,
    private route$: ActivatedRoute,
    private _el: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

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

      resident_id: [this.resident_id, Validators.required]
    });

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };

    this.subscribe('list_medication');
    this.subscribe('list_form_factor');
    this.subscribe('list_physician');
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_medication':
        this.$subscriptions[key] = this.medication$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.medications = res;
          }
        });
        break;
      case 'list_form_factor':
        this.$subscriptions[key] = this.form_factor$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.form_factors = res;
          }
        });
        break;
      case 'list_physician':
        this.$subscriptions[key] = this.physician$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.physicians = res;
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
            this.$subscriptions[key] = this.medication$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.medications = res;
                this.form.get('medication_id').setValue(data[0]);
              }
            });
            return null;
          });
        break;
      case 'form_factor':
        this.create_modal(
          this.modal$,
          MedicationFormFactorFormComponent,
          data => this.form_factor$.add(data),
          data => {
            this.$subscriptions[key] = this.form_factor$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.form_factors = res;
                this.form.get('form_factor_id').setValue(data[0]);
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
