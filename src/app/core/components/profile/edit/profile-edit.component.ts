import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';
import {PhoneType} from '../../../models/phone-type.enum';
import {CoreValidator} from '../../../../shared/utils/core-validator';
import {StringUtil} from '../../../../shared/utils/string-util';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent extends AbstractForm implements OnInit {
  @ViewChild('avatar_file') avatar_file: ElementRef;

  photo_file_name: string;
  photo_size_exceed: boolean;

  phone_types: { id: PhoneType, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profile$: ProfileService
  ) {
    super(modal$);

    this.submit = (data: any) => {
      return this.profile$.edit(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = 'Your data have been successfully saved.';

      this.router.navigate(['profile/me']);
    };

    this.photo_size_exceed = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: ['', Validators.compose([CoreValidator.notEmpty])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phones: this.formBuilder.array([]),
      avatar: [null],
    });

    this.profile$.get().subscribe(user => {
      this.set_form_data(this, this.form, user);
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
            this.form.get('avatar').setValue(null);
          } else {
            this.photo_size_exceed = false;
            this.form.get('avatar').setValue(reader.result);
          }
        }
      };
      (this.avatar_file.nativeElement as HTMLInputElement).value = null;
    }

    return false;
  }

  select_file() {
    (this.avatar_file.nativeElement as HTMLInputElement).click();
  }

  clear_file() {
    this.photo_file_name = null;
    this.photo_size_exceed = false;
    this.form.get('avatar').setValue(null);
  }

}
