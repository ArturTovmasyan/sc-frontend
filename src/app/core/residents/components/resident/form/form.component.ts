import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Gender} from '../../../models/gender.enum';
import {PhoneType} from '../../../../models/phone-type.enum';
import {Space} from '../../../../models/space';
import {Salutation} from '../../../models/salutation';
import {SpaceService} from '../../../../services/space.service';
import {SalutationService} from '../../../services/salutation.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {FormComponent as SalutationFormComponent} from '../../salutation/form/form.component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  salutations: Salutation[];
  spaces: Space[];

  genders: { id: Gender, name: string }[];

  phone_types: { id: PhoneType, name: string }[];

  @ViewChild('photo_file') photo_file: ElementRef;

  disabledDate: (date: Date) => boolean;

  constructor(
    private formBuilder: FormBuilder,
    private salutation$: SalutationService,
    private space$: SpaceService,
    private modal$: NzModalService
  ) {
    super();

    // TODO: review move to util
    this.disabledDate = (current: Date): boolean => {
      const today = new Date();
      return differenceInCalendarDays(current, today) > 0;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      birthday: [new Date(), Validators.required],
      gender: [null, Validators.required],
      photo: [null],

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
    this.form.addControl('space_id', new FormControl(null, [Validators.required]));
    this.subscribe('list_space');
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
          number: ['', Validators.required],
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
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('photo').setValue(reader.result);
      };
    }

    return false;
  }

  select_file() {
    (this.photo_file.nativeElement as HTMLInputElement).click();
  }
}
