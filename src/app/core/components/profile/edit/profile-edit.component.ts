import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';
import {PhoneType} from '../../../models/phone-type.enum';

@Component({
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent extends AbstractForm implements OnInit {
  @ViewChild('avatar_file') avatar_file: ElementRef;

  phone_types: { id: PhoneType, name: string }[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profile$: ProfileService) {
    super();

    this.submit = (data: any) => {
      return this.profile$.edit(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = 'Your data have been successfully saved.';

      this.router.navigate(['profile/me']);
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phones: this.formBuilder.array([]),
      avatar: [null, Validators.required],
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
        this.form.get('avatar').setValue(reader.result);
      };
    }

    return false;
  }

  select_file() {
    (this.avatar_file.nativeElement as HTMLInputElement).click();
  }
}


