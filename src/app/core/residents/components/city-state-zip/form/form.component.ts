import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {Space} from '../../../../models/space';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  constructor(private formBuilder: FormBuilder, private space$: SpaceService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      state_full: ['', Validators.compose([Validators.required, Validators.max(100)])],
      state_abbr: ['', Validators.compose([Validators.required, Validators.pattern(CoreValidator.Patterns.STATE_ABBR)])],
      city: ['', Validators.compose([Validators.required, Validators.max(100)])],
      zip_main: ['', Validators.compose([Validators.required, Validators.pattern(CoreValidator.Patterns.ZIP_MAIN)])],
      zip_sub: ['', Validators.compose([Validators.max(100)])],

      space_id: [null, Validators.required],
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });
  }

}
