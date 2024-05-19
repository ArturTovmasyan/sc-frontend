import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {PhoneType} from '../../../../models/phone-type.enum';
import {OrganizationService} from '../../../services/organization.service';
import {Organization} from '../../../models/organization';
import {SpaceService} from '../../../../services/space.service';
import {AuthGuard} from '../../../../guards/auth.guard';
import {Space} from '../../../../models/space';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];
  organizations: Organization[];

  phone_types: { id: PhoneType, name: string }[];

  constructor(
    private formBuilder: FormBuilder,
    private organization$: OrganizationService,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      first_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],

      email: ['', Validators.compose([Validators.required, Validators.email])],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      phones: this.formBuilder.array([]),

      organization_id: [null],
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

    this.subscribe('list_organization');

    this.add_space();
  }

  private add_space() {
    if (this.auth_$.checkPermission(['persistence-security-space'])) {
      this.form.addControl('space_id', new FormControl(null, [Validators.required]));
      this.subscribe('list_space');
    }
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
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      case 'list_organization':
        this.$subscriptions[key] = this.organization$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.organizations = res;

            if (params) {
              this.form.get('organization_id').setValue(params.organization_id);
            }
          }
        });
        break;
      default:
        break;
    }
  }
}
