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

  beds_configured: number;

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private csz$: CityStateZipService,
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
      license: ['', Validators.compose([Validators.maxLength(20)])],
      beds_licensed: ['', Validators.compose([Validators.required, CoreValidator.group_capacity])],
      beds_target: ['', Validators.compose([Validators.required, CoreValidator.group_capacity])],
      address: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],
      csz_id: [null, Validators.required],
    });

    this.subscribe('vc_beds_licensed');
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
        this.$subscriptions[key] = this.csz$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;

            if (params) {
              this.form.get('csz_id').setValue(params.csz_id);
            }
          }
        });
        break;
      case 'vc_beds_licensed':
        this.$subscriptions[key] = this.form.get('beds_licensed').valueChanges.subscribe(next => {
          this.form.get('beds_target').setValue(this.form.get('beds_target').value);
        });
        break;
      default:
        break;
    }
  }

  before_set_form_data(data: any, previous_data?: any): void {
    if (this.edit_mode) {
      this.beds_configured = data.beds_configured;
    }
  }
}
