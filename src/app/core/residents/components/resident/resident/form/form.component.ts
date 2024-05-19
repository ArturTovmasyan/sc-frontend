import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Gender} from '../../../../models/gender.enum';
import {PhoneType} from '../../../../../models/phone-type.enum';
import {Space} from '../../../../../models/space';
import {Salutation} from '../../../../models/salutation';
import {SpaceService} from '../../../../../services/space.service';
import {SalutationService} from '../../../../services/salutation.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {FormComponent as SalutationFormComponent} from '../../../salutation/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {AuthGuard} from '../../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  salutations: Salutation[];
  spaces: Space[];

  genders: { id: Gender, name: string }[];

  phone_types: { id: PhoneType, name: string }[];

  @ViewChild('photo_file') photo_file: ElementRef;

  photo_file_name: string;
  photo_size_exceed: boolean;

  disabledDate: (date: Date) => boolean;

  constructor(
    private formBuilder: FormBuilder,
    private salutation$: SalutationService,
    private space$: SpaceService,
    private modal$: NzModalService,
    private auth_$: AuthGuard
  ) {
    super();

    this.disabledDate = (current: Date): boolean => {
      const today = DateHelper.convertUTC(new Date());
      return differenceInCalendarDays(current, today) > 0;
    };

    this.photo_size_exceed = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.compose([CoreValidator.notEmpty])],
      middle_name: [''],
      last_name: ['', Validators.compose([CoreValidator.notEmpty])],
      birthday: [new Date(), Validators.required],
      gender: [null, Validators.required],
      photo: [null],

      ssn: ['', Validators.compose([CoreValidator.ssn])],

      salutation_id: [null, Validators.required],

      phones: this.formBuilder.array([]),
    });

    this.subscribe('list_salutation');

    // TODO: review
    this.genders = [
      {id: Gender.MALE, name: 'Male'},
      {id: Gender.FEMALE, name: 'Female'},
    ];

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

  onFileChange($event) {
    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length > 0) {
      const file = $event.target.files[0];
      this.photo_file_name = FormComponent.truncate(file.name, 25);
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const result = reader.result as string;
          const suffix = result.substr(-2);
          const y = suffix === '==' ? 2 : (suffix === '=' ? 1 : 0);

          const max_file_size = (10 * 1024 * 1024 + 32);
          const file_size = (result.length * (3 / 4)) - y;

          if (file_size > max_file_size) {
            this.photo_size_exceed = true;
            this.form.get('photo').setValue(null);
          } else {
            this.photo_size_exceed = false;
            this.form.get('photo').setValue(reader.result);
          }
        }
      };
      (this.photo_file.nativeElement as HTMLInputElement).value = null;
    }

    return false;
  }

  select_file() {
    (this.photo_file.nativeElement as HTMLInputElement).click();
  }

  clear_file() {
    this.photo_file_name = null;
    this.photo_size_exceed = false;
    this.form.get('photo').setValue(null);
  }

  private static truncate(value: string, length: number): string {
    return value.length > length ? (value.slice(0, length - 3) + '...') : value;
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      data.birthday = DateHelper.convertUTC(data.birthday);
    }
  }

}
