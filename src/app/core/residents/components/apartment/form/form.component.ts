import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {ValidationPatterns} from '../../../../../shared/constants/validation.patterns';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  city_state_zips: CityStateZip[];
  spaces: Space[];

  constructor(private formBuilder: FormBuilder, private city_state_zip$: CityStateZipService, private space$: SpaceService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.compose([Validators.required, Validators.max(100)])],
      shorthand: ['', Validators.compose([Validators.required, Validators.max(100)])],
      description: ['', Validators.compose([Validators.required, Validators.max(1000)])],
      phone: ['', Validators.pattern(ValidationPatterns.PHONE)],
      fax: ['', Validators.pattern(ValidationPatterns.PHONE)],
      license: ['', Validators.compose([Validators.max(20)])],
      license_capacity: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.GROUP_CAPACITY)])],
      capacity: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.GROUP_CAPACITY)])],
      address: ['', Validators.compose([Validators.required, Validators.max(100)])],
      csz_id: [null, Validators.required],
      space_id: [null, Validators.required],
    });

    this.city_state_zip$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.city_state_zips = res;
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });
  }

}
