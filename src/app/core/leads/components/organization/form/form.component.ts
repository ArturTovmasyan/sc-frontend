import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ReferrerTypeService} from '../../../services/referrer-type.service';
import {ReferrerType} from '../../../models/referrer-type';
import {CityStateZip} from '../../../../residents/models/city-state-zip';
import {CityStateZipService} from '../../../../residents/services/city-state-zip.service';
import {PhoneType} from '../../../../models/phone-type.enum';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as ReferrerTypeFormComponent} from '../../referrer-type/form/form.component';
import {FormComponent as CityStateZipFormComponent} from '../../../../residents/components/city-state-zip/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  referrer_types: ReferrerType[];
  city_state_zips: CityStateZip[];

  phone_types: { id: PhoneType, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private referrer_type$: ReferrerTypeService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'referrer_type', component: ReferrerTypeFormComponent},
         {key: 'csz', component: CityStateZipFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],

      address_1: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      address_2: ['', Validators.compose([Validators.maxLength(100)])],

      website_url: ['', Validators.compose([Validators.maxLength(100)])],
      emails: [[]],


      phones: this.formBuilder.array([]),

      category_id: [null, Validators.required],
      csz_id: [null, Validators.required]
    });

    this.phone_types = [
      {id: PhoneType.HOME, name: 'HOME'},
      {id: PhoneType.MOBILE, name: 'MOBILE'},
      {id: PhoneType.WORK, name: 'WORK'},
      {id: PhoneType.OFFICE, name: 'OFFICE'},
      {id: PhoneType.EMERGENCY, name: 'EMERGENCY'},
      {id: PhoneType.FAX, name: 'FAX'},
      {id: PhoneType.ROOM, name: 'ROOM'}
    ];

    this.subscribe('list_referrer_type');
    this.subscribe('list_csz');
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'phones':
        return this.formBuilder.group({
          id: [null],
          type: [null, Validators.required],
          number: ['', Validators.compose([Validators.required, CoreValidator.phone])],
          primary: [false],
          compatibility: [null]
        });
      default:
        return null;
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_referrer_type':
        this.$subscriptions[key] = this.referrer_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.referrer_types = res;

            if (params) {
              this.form.get('category_id').setValue(params.referrer_type_id);
            }
          }
        });
        break;
      case 'list_csz':
        this.$subscriptions[key] = this.city_state_zip$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;

            if (params) {
              this.form.get('csz_id').setValue(params.csz_id);
            }
          }
        });
        break;
      default:
        break;
    }
  }

}
