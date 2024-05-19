import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent as InsuranceCompanyFormComponent} from '../../../insurance-company/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {InsuranceCompanyService} from '../../../../services/insurance-company.service';
import {InsuranceCompany} from '../../../../models/insurance-company';
import {FileModel} from '../../../../../models/file-model';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  companies: InsuranceCompany[];

  @ViewChild('first_file') el_first_file: ElementRef;
  @ViewChild('second_file') el_second_file: ElementRef;

  files: FileModel[];

  constructor(
    private formBuilder: FormBuilder,
    private insurance_company$: InsuranceCompanyService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.files = [
      {file_name: '', size_exceed: false, form_item: 'first_file', element: this.el_first_file},
      {file_name: '', size_exceed: false, form_item: 'second_file', element: this.el_second_file},
    ];

    this.form = this.formBuilder.group({
      id: [''],

      medical_record_number: ['', Validators.compose([CoreValidator.insurance_number, Validators.maxLength(32)])],
      group_number: ['', Validators.compose([CoreValidator.insurance_number, Validators.maxLength(32)])],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      first_file: [null],
      second_file: [null],

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

  onFileChange(model: FileModel, $event) {
    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length > 0) {
      const file = $event.target.files[0];
      model.file_name = FileModel.truncate(file.name, 25);
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const result = reader.result as string;
          const suffix = result.substr(-2);
          const y = suffix === '==' ? 2 : (suffix === '=' ? 1 : 0);

          const max_file_size = (10 * 1024 * 1024 + 32);
          const file_size = (result.length * (3 / 4)) - y;

          if (file_size > max_file_size) {
            model.size_exceed = true;
            this.form.get(model.form_item).setValue(null);
          } else {
            model.size_exceed = false;
            this.form.get(model.form_item).setValue(reader.result);
          }
        }
      };
      (model.element.nativeElement as HTMLInputElement).value = null;
    }

    return false;
  }

  select_file(model: FileModel) {
    (model.element.nativeElement as HTMLInputElement).click();
  }

  clear_file(model: FileModel) {
    model.file_name = null;
    model.size_exceed = false;
    this.form.get(model.form_item).setValue(null);
  }

}
