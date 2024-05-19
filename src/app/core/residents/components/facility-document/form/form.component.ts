﻿import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FileModel} from '../../../../models/file-model';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';
import {StringUtil} from '../../../../../shared/utils/string-util';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  @ViewChild('file', {static: true}) el_file: ElementRef;

  files: FileModel[];

  facilities: Facility[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private facility$: FacilityService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.files = [
      {file_name: '', size_exceed: false, form_item: 'file', element: this.el_file},
    ];

    this.form = this.formBuilder.group({
      id: [''],

      title: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],

      file: [null],

      facility_id: [null, Validators.required]
    });

    this.subscribe('list_facility');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().subscribe(res => {
          if (res) {
            this.facilities = res;
          }
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
      model.file_name = StringUtil.truncate(file.name, 25);
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

  before_submit(): void {
    this.form.get('facility_id').enable();
  }

}