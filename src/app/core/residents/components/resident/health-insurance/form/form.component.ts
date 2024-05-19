import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent as InsuranceCompanyFormComponent} from '../../../insurance-company/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {InsuranceCompanyService} from '../../../../services/insurance-company.service';
import {InsuranceCompany} from '../../../../models/insurance-company';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  companies: InsuranceCompany[];

  constructor(
    private formBuilder: FormBuilder,
    private insurance_company$: InsuranceCompanyService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      medical_record_number: ['', Validators.compose([CoreValidator.insurance_number, Validators.maxLength(512)])],
      group_number: ['', Validators.compose([CoreValidator.insurance_number, Validators.maxLength(32)])],
      notes: ['', Validators.compose([Validators.maxLength(32)])],

      company_id: [null, Validators.required],
      resident_id: [null, Validators.required],
    });

    this.subscribe('rs_resident');
    this.subscribe('list_insurance_company');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_insurance_company':
        this.$subscriptions[key] = this.insurance_company$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.companies = res;

            if (params) {
              this.form.get('company_id').setValue(params.company_id);
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
      case 'insurance_company':
        this.create_modal(
          this.modal$,
          InsuranceCompanyFormComponent,
          data => this.insurance_company$.add(data),
          data => {
            this.subscribe('list_insurance_company', {company_id: data[0]});
        return null;
    });
        break;
      default:
        break;
    }
  }

}
