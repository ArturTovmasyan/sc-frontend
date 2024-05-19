import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {ValidationPatterns} from '../../../../../shared/constants/validation.patterns';
import {Salutation} from '../../../models/salutation';
import {SalutationService} from '../../../services/salutation.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  salutations: Salutation[];
  city_state_zips: CityStateZip[];
  spaces: Space[];

  constructor(
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private salutation$: SalutationService,
    private space$: SpaceService
  ) {
    super();
  }

  ngOnInit(): void {
    // TODO(haykg): add masked inputs to phones
    this.form = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      address_1: ['', Validators.required],
      address_2: [''],
      office_phone: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.PHONE)])],
      fax: ['', Validators.compose([Validators.pattern(ValidationPatterns.PHONE)])],
      emergency_phone: ['', Validators.compose([Validators.pattern(ValidationPatterns.PHONE)])],
      email: ['', Validators.compose([Validators.email])],
      website_url: [''],
      salutation_id: [null, Validators.required],
      csz_id: [null, Validators.required],
      space_id: [null, Validators.required],
    });

    this.city_state_zip$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.city_state_zips = res;
      }
    });

    this.salutation$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.salutations = res;
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
