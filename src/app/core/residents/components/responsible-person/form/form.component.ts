﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {Salutation} from '../../../models/salutation';
import {SalutationService} from '../../../services/salutation.service';
import {PhoneType} from '../../../../models/phone-type.enum';
import {FormComponent as CSZFormComponent} from '../../city-state-zip/form/form.component';
import {FormComponent as SalutationFormComponent} from '../../salutation/form/form.component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  salutations: Salutation[];
  city_state_zips: CityStateZip[];
  spaces: Space[];

  private _loaded_city_state_zips: boolean;
  private _loaded_salutations: boolean;
  private _loaded_spaces: boolean;

  phone_types: { id: PhoneType, name: string }[];

  constructor(
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private salutation$: SalutationService,
    private space$: SpaceService,
    private modal$: NzModalService
  ) {
    super();
    this.loaded.next(false);
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
      email: ['', Validators.compose([Validators.email])],
      emergency: [false, Validators.required],
      financially: [false, Validators.required],
      salutation_id: [null, Validators.required],
      csz_id: [null, Validators.required],
      space_id: [null, Validators.required],

      phones: this.formBuilder.array([]),
    });

    this.subscribe('list_salutation');
    this.subscribe('list_csz');
    this.subscribe('list_space');

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
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
          this._loaded_spaces = true;
          this.loaded.next(this._loaded_city_state_zips && this._loaded_salutations && this._loaded_spaces);
        });
        break;
      case 'list_csz':
        this.$subscriptions[key] = this.city_state_zip$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;
          }
          this._loaded_city_state_zips = true;
          this.loaded.next(this._loaded_city_state_zips && this._loaded_salutations && this._loaded_spaces);
        });
        break;
      case 'list_salutation':
        this.$subscriptions[key] = this.salutation$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.salutations = res;
          }
          this._loaded_salutations = true;
          this.loaded.next(this._loaded_city_state_zips && this._loaded_salutations && this._loaded_spaces);
        });
        break;
      default:
        break;
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'csz':
        this.create_modal(
          this.modal$,
          CSZFormComponent,
          data => this.city_state_zip$.add(data),
          data => {
            this.$subscriptions[key] = this.city_state_zip$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.city_state_zips = res;
                this.form.get('csz_id').setValue(data[0]);
              }
            });
            return null;
          });
        break;
      case 'salutation':
        this.create_modal(
          this.modal$,
          SalutationFormComponent,
          data => this.salutation$.add(data),
          data => {
            this.$subscriptions[key] = this.salutation$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.salutations = res;
                this.form.get('salutation_id').setValue(data[0]);
              }
            });
            return null;
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
          number: ['', Validators.required],
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
