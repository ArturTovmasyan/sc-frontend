import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {Salutation} from '../../../models/salutation';
import {SalutationService} from '../../../services/salutation.service';
import {PhysicianSpeciality} from '../../../models/physician-speciality';
import {PhysicianSpecialityService} from '../../../services/physician-speciality.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  sub_form_enabled: boolean = false;

  salutations: Salutation[];
  city_state_zips: CityStateZip[];
  spaces: Space[];
  specialities: PhysicianSpeciality[];

  constructor(
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private salutation$: SalutationService,
    private speciality$: PhysicianSpecialityService,
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
      office_phone: ['', Validators.compose([Validators.required, CoreValidator.phone])],
      fax: ['', Validators.compose([CoreValidator.phone])],
      emergency_phone: ['', Validators.compose([CoreValidator.phone])],
      email: ['', Validators.compose([Validators.email])],
      website_url: [''],

      speciality_id: [null, Validators.required],
      speciality: this.formBuilder.group({
        title: ['', Validators.compose([Validators.required, Validators.maxLength(255)])]
      }),

      salutation_id: [null, Validators.required],
      csz_id: [null, Validators.required],
      space_id: [null, Validators.required],
    });

    this.toggle_sub_form();

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

    this.speciality$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.specialities = res;
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });
  }

  toggle_sub_form() {
    if (this.sub_form_enabled) {
      this.form.get('speciality').enable();
      this.form.get('speciality_id').disable();
    } else {
      this.form.get('speciality_id').enable();
      this.form.get('speciality').disable();
    }

    this.sub_form_enabled = !this.sub_form_enabled;
  }

}
