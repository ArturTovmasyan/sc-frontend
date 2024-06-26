﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {Salutation} from '../../../models/salutation';
import {SalutationService} from '../../../services/salutation.service';
import {PhoneType} from '../../../../models/phone-type.enum';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as SalutationFormComponent} from '../../salutation/form/form.component';
import {FormComponent as CityStateZipFormComponent} from '../../city-state-zip/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  salutations: Salutation[];
  city_state_zips: CityStateZip[];
  spaces: Space[];

  phone_types: { id: PhoneType, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private csz$: CityStateZipService,
    private salutation$: SalutationService,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'salutation', component: SalutationFormComponent},
         {key: 'csz', component: CityStateZipFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      middle_name: ['', Validators.compose([Validators.maxLength(60)])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      address_1: ['', Validators.compose([CoreValidator.notEmpty])],
      address_2: [''],
      email: ['', Validators.compose([Validators.email])],
      salutation_id: [null, Validators.required],
      csz_id: [null, Validators.required],

      phones: this.formBuilder.array([]),
    });

    this.subscribe('list_salutation');
    this.subscribe('list_csz');

    // TODO: review
    this.phone_types = [
      {id: PhoneType.HOME, name: 'HOME'},
      {id: PhoneType.MOBILE, name: 'MOBILE'},
      {id: PhoneType.WORK, name: 'WORK'},
      {id: PhoneType.OFFICE, name: 'OFFICE'},
      {id: PhoneType.EMERGENCY, name: 'EMERGENCY'},
      {id: PhoneType.FAX, name: 'FAX'},
      {id: PhoneType.ROOM, name: 'ROOM'}
    ];

    this.add_space();
  }

  private add_space() {
    if (this.auth_$.checkPermission(['persistence-security-space'])) {
      this.form.addControl('space_id', new FormControl(null, [Validators.required]));
      this.subscribe('list_space');
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      case 'list_csz':
        this.$subscriptions[key] = this.csz$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;

            if (params) {
              this.form.get('csz_id').setValue(params.csz_id);
            }
          }
        });
        break;
      case 'list_salutation':
        this.$subscriptions[key] = this.salutation$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.salutations = res;

            if (params) {
              this.form.get('salutation_id').setValue(params.salutation_id);
            }
          }
        });
        break;
      default:
        break;
    }
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'phones':
        return this.formBuilder.group({
          id: [null],
          type: [null, Validators.required],
          number: ['', Validators.compose([Validators.required, CoreValidator.phone])],
          extension: [''],
          primary: [false],
          sms_enabled: [false],
          compatibility: [null]
        });
      default:
        return null;
    }
  }
}
