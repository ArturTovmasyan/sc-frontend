import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {AuthGuard} from '../../../../guards/auth.guard';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as CityStateZipFormComponent} from '../../city-state-zip/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  city_state_zips: CityStateZip[];
  spaces: Space[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'csz', component: CityStateZipFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      shorthand: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      description: ['', Validators.compose([Validators.maxLength(1000)])],
      phone: ['', CoreValidator.phone],
      fax: ['', CoreValidator.phone],
      number_of_floors: ['', Validators.compose([Validators.required, CoreValidator.number_of_floors])],
      license: ['', Validators.compose([Validators.maxLength(20)])],
      license_capacity: ['', Validators.compose([Validators.required, CoreValidator.group_capacity])],
      capacity: ['', Validators.compose([Validators.required, CoreValidator.group_capacity])],
      address: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      csz_id: [null, Validators.required],
    });

    this.subscribe('vc_license_capacity');
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
      case 'vc_license_capacity':
        this.$subscriptions[key] = this.form.get('license_capacity').valueChanges.subscribe(next => {
          this.form.get('capacity').setValue(this.form.get('capacity').value);
        });
        break;
      default:
        break;
    }
  }

}
