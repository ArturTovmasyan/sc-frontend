import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
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
      name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      address_1: [''],
      address_2: [''],
      csz_id: [null, Validators.compose([])],
      phone: ['', CoreValidator.phone],
      email: ['', Validators.compose([Validators.email])],
    });

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
      default:
        break;
    }
  }
}
