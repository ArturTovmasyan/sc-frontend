import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {CoreValidator} from '../../../../shared/utils/core-validator';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  private _space: string;

  get space(): string {
    return this._space;
  }

  set space(value: string) {
    this._space = value;
  }

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      subject: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(255)])],
      message: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(1024)])],
    });
  }

}
