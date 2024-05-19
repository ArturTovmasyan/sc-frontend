import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {first} from 'rxjs/operators';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Gender} from '../../../../models/gender.enum';
import {PhoneType} from '../../../../../models/phone-type.enum';
import {Space} from '../../../../../models/space';
import {Salutation} from '../../../../models/salutation';
import {SpaceService} from '../../../../../services/space.service';
import {SalutationService} from '../../../../services/salutation.service';
import {FormComponent as SalutationFormComponent} from '../../../salutation/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {AuthGuard} from '../../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';
import {GroupType} from '../../../../models/group-type.enum';
import {CityStateZip} from '../../../../models/city-state-zip';
import {CareLevel} from '../../../../models/care-level';
import {CareLevelService} from '../../../../services/care-level.service';
import {CityStateZipService} from '../../../../services/city-state-zip.service';
import {StringUtil} from '../../../../../../shared/utils/string-util';
import {ResidentService} from '../../../../services/resident.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

  group_type: GroupType;

  city_state_zips: CityStateZip[];
  care_levels: CareLevel[];

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
    private resident$: ResidentService,
    private care_level$: CareLevelService,
    private city_state_zip$: CityStateZipService,
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

      /*** Admission ***/
      dnr: [false, [Validators.required]],
      polst: [false, [Validators.required]],
      ambulatory: [false, [Validators.required]],
      care_group: [null, [Validators.compose([Validators.required, CoreValidator.care_group])]],
      care_level_id: [null, [Validators.required]],
      address: ['', [Validators.required]],
      csz_id: [null, [Validators.required]]
    });

    this.form.get('dnr').disable();
    this.form.get('polst').disable();
    this.form.get('ambulatory').disable();
    this.form.get('care_group').disable();
    this.form.get('care_level_id').disable();
    this.form.get('address').disable();
    this.form.get('csz_id').disable();

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
      case 'last_admission':
        this.$subscriptions[key] = this.resident$.last_admission(this.form.get('id').value).pipe(first()).subscribe(res => {
          if (res) {
            this.group_type = res.group_type;

            this.subscribe('list_care_level');
            this.subscribe('list_city_state_zip');

            this.form.get('dnr').setValue(res.dnr);
            this.form.get('polst').setValue(res.polst);
            this.form.get('ambulatory').setValue(res.ambulatory);
            this.form.get('care_group').setValue(res.care_group);
            this.form.get('care_level_id').setValue(res.care_level ? res.care_level.id : null);
            this.form.get('address').setValue(res.address);
            this.form.get('csz_id').setValue(res.csz ? res.csz.id : null);


            switch(this.group_type) {
              case GroupType.FACILITY:
                this.form.get('dnr').enable();
                this.form.get('polst').enable();
                this.form.get('ambulatory').enable();
                this.form.get('care_group').enable();
                this.form.get('care_level_id').enable();
                break;
              case GroupType.REGION:
                this.form.get('care_group').enable();
                this.form.get('care_level_id').enable();
                this.form.get('dnr').enable();
                this.form.get('polst').enable();
                this.form.get('ambulatory').enable();
                this.form.get('address').enable();
                this.form.get('csz_id').enable();
                break;
            }
          }
        });
        break;
      case 'list_care_level':
        this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;
          }
        });
        break;
      case 'list_city_state_zip':
        this.$subscriptions[key] = this.city_state_zip$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;
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
      this.photo_file_name = StringUtil.truncate(file.name, 25);
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

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      data.birthday = DateHelper.convertUTC(data.birthday);
    }
  }

  after_set_form_data(): void {
    super.after_set_form_data();

    if (this.edit_mode) {
      this.subscribe('last_admission');
    } else {
      this.form.get('dnr').disable();
      this.form.get('polst').disable();
      this.form.get('ambulatory').disable();
      this.form.get('care_group').disable();
      this.form.get('care_level_id').disable();
      this.form.get('address').disable();
      this.form.get('csz_id').disable();
    }
  }

}
