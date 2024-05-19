import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ValidationPatterns} from '../../../../../shared/constants/validation.patterns';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      state_full: ['', Validators.compose([Validators.required, Validators.max(100)])],
      state_abbr: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.STATE_ABBR)])],
      city: ['', Validators.compose([Validators.required, Validators.max(100)])],
      zip_main: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.ZIP_MAIN)])],
      zip_sub: ['', Validators.compose([Validators.max(100)])]
    });
  }

}
