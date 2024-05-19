import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {RoleService} from '../../../services/role.service';
import {Role} from '../../../../models/role';
import {Space} from '../../../../models/space';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {PhoneType} from '../../../../models/phone-type.enum';
import {GrantService} from '../../../services/grant.service';
import {AuthGuard} from '../../../../guards/auth.guard';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit, AfterViewInit {
  roles: Role[];
  spaces: Space[];

  phone_types: { id: PhoneType, name: string }[];

  grant_lists: {};

  constructor(
    private formBuilder: FormBuilder,
    private role$: RoleService,
    private grant$: GrantService,
    private space$: SpaceService,
    private auth_$: AuthGuard,
    private _el: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      username: ['', Validators.compose([CoreValidator.notEmpty])],
      first_name: ['', Validators.compose([CoreValidator.notEmpty])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty])],
      email: ['', Validators.compose([Validators.required, Validators.email])],

      password: ['', Validators.compose([Validators.required, CoreValidator.password])],
      re_password: ['', Validators.compose([Validators.required, CoreValidator.match_other('password', 'password')])],
      enabled: [true, Validators.required],

      phones: this.formBuilder.array([]),

      roles: [[]],

      grants: this.formBuilder.group({}),
    });

    this.subscribe('vc_role');
    this.subscribe('list_role');

    this.phone_types = [
      {id: PhoneType.HOME, name: 'list.phone_type.HOME'},
      {id: PhoneType.MOBILE, name: 'list.phone_type.MOBILE'},
      {id: PhoneType.WORK, name: 'list.phone_type.WORK'},
      {id: PhoneType.OFFICE, name: 'list.phone_type.OFFICE'},
      {id: PhoneType.EMERGENCY, name: 'list.phone_type.EMERGENCY'},
      {id: PhoneType.FAX, name: 'list.phone_type.FAX'},
      {id: PhoneType.ROOM, name: 'list.phone_type.ROOM'}
    ];

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.tabSelected.next([].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el));
      }
    };

    this.add_space();
  }

  ngAfterViewInit(): void {
    this.tabCountRecalculate(this._el);
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
      case 'list_role':
        this.$subscriptions[key] = this.role$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.roles = res;

            //this.form.get('roles').setValue(this.form.get('roles').value);
          }
        });
        break;
      case 'vc_role':
        this.$subscriptions[key] = this.form.get('roles').valueChanges.subscribe(next => {
          if (next != null && Array.isArray(next)) {
            this.grant$.role(next).pipe(first()).subscribe(res => {
              if (res) {
                this.grant_lists = res;

                if (Object.keys(res).length > 0) {
                  const items = this.form.get('grants') as FormGroup;

                  Object.keys(res).forEach(_key => {
                    if (items.get(_key) === null) {
                      items.addControl(_key, this.formBuilder.control([]));
                    }

                    if (res[_key].hasOwnProperty('url')) {
                      this.grant$.get(res[_key].url).subscribe(res_ => {
                        if (res_) {
                          this.grant_lists[_key]['items'] = res_;
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
        break;
      default:
        break;
    }
  }

  get grants(): FormGroup {
    return this.form.get('grants') as FormGroup;
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

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      this.form.get('password').setErrors(null);
      this.form.get('password').clearValidators();
      this.form.get('re_password').setErrors(null);
      this.form.get('re_password').clearValidators();

      this.form.get('password').setValidators(CoreValidator.password);
      this.form.get('re_password').setValidators(CoreValidator.match_other('password', 'password'));

      if (data !== null && data.hasOwnProperty('grants')) {
        if (Object.keys(data.grants).length > 0) {
          const items = this.form.get('grants') as FormGroup;

          Object.keys(data.grants).forEach(key => {
            if (items.get(key) === null) {
              items.addControl(key, this.formBuilder.control([]));
            }
          });
        }
      }
    }
  }

  before_submit(): void {
    const form_value = this.form.get('grants').value;
    const final_value = {};
    Object.keys(form_value).forEach(key => {
      if (this.grant_lists.hasOwnProperty(key)) {
        final_value[key] = form_value[key];
      } else {
        this.grants.removeControl(key);
      }
    });
  }
}
