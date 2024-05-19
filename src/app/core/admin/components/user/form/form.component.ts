import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {RoleService} from '../../../services/role.service';
import {Role} from '../../../../models/role';
import {Space} from '../../../../models/space';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {PhoneType} from '../../../../models/phone-type.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  roles: Role[];
  spaces: Space[];

  phone_types: { id: PhoneType, name: string }[];

  selectedTab: number;

  constructor(
    private formBuilder: FormBuilder,
    private role$: RoleService,
    private space$: SpaceService,
    private _el: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedTab = 0;

    this.form = this.formBuilder.group({
      id: [''],
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],

      password: ['', Validators.compose([Validators.required, CoreValidator.password])],
      re_password: ['', Validators.compose([Validators.required, CoreValidator.match_other('password', 'password')])],
      enabled: [true, Validators.required],

      phones: this.formBuilder.array([]),

      role_id: [null],
      space_id: [null],
    });

    this.role$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.roles = res;
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
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

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'phones':
        return this.formBuilder.group({
          id: [null],
          type: [null, Validators.required],
          number: ['', Validators.compose([Validators.required, CoreValidator.phone])],
          primary: [false],
          sms_enabled: [false],
          compatibility: [null]
        });
      default:
        return null;
    }
  }

  public before_set_form_data(): void {
    if (this.edit_mode) {
      this.form.get('password').setErrors(null);
      this.form.get('password').clearValidators();
      this.form.get('re_password').setErrors(null);
      this.form.get('re_password').clearValidators();

      this.form.get('password').setValidators(CoreValidator.password);
      this.form.get('re_password').setValidators(CoreValidator.match_other('password', 'password'));
    }
  }

}
