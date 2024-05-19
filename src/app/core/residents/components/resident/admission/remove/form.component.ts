import {Component, OnInit} from '@angular/core';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    protected modal$: ModalFormService,
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null, Validators.required]
    });
  }
}
