import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as CSZFormComponent} from '../../city-state-zip/form/form.component';
import {FormComponent as SpecialityFormComponent} from '../../physician-speciality/form/form.component';
import {FormComponent as SalutationFormComponent} from '../../salutation/form/form.component';
import {AuthGuard} from '../../../../guards/auth.guard';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  salutations: Salutation[];
  city_state_zips: CityStateZip[];
  spaces: Space[];
  specialities: PhysicianSpeciality[];

  constructor(
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private salutation$: SalutationService,
    private speciality$: PhysicianSpecialityService,
    private space$: SpaceService,
    private modal$: NzModalService,
    private auth_$: AuthGuard
  ) {
    super();
  }

  ngOnInit(): void {
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
      salutation_id: [null, Validators.required],
      csz_id: [null, Validators.required],
    });

    this.subscribe('list_salutation');
    this.subscribe('list_speciality');
    this.subscribe('list_csz');

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
        this.$subscriptions[key] = this.city_state_zip$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;

            if (params) {
              this.form.get('csz_id').setValue(params.csz_id);
            }
          }
        });
        break;
      case 'list_speciality':
        this.$subscriptions[key] = this.speciality$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.specialities = res;

            if (params) {
              this.form.get('speciality_id').setValue(params.speciality_id);
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

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'csz':
        this.create_modal(
          this.modal$,
          CSZFormComponent,
          data => this.city_state_zip$.add(data),
          data => {
            this.subscribe('list_csz', {csz_id: data[0]});
            return null;
          });
        break;
      case 'speciality':
        this.create_modal(
          this.modal$,
          SpecialityFormComponent,
          data => this.speciality$.add(data),
          data => {
            this.subscribe('list_speciality', {speciality_id: data[0]});
            return null;
          });
        break;
      case 'salutation':
        this.create_modal(
          this.modal$,
          SalutationFormComponent,
          data => this.salutation$.add(data),
          data => {
            this.subscribe('list_salutation', {salutation_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

}
