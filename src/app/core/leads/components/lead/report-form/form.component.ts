import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      date_from: [new Date(), Validators.compose([Validators.required])],
      date_to: [new Date(), Validators.compose([Validators.required])]
    });
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      data.date_from = DateHelper.convertUTC(data.date_from);
      data.date_to = DateHelper.convertUTC(data.date_to);
    }
  }

}
