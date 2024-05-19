import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../models/space';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(200)])]
    });
  }

}
