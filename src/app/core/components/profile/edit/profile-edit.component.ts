import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';
import {UploadFile} from 'ng-zorro-antd';

@Component({
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent extends AbstractForm implements OnInit {
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];
  previewImage = '';
  previewVisible = false;

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
    };
  }

  ngOnInit(): void {
    this.profile$.get().subscribe(user => {
      this.form = this.formBuilder.group({
        password: ['', Validators.required],
        firstName: [user.first_name, Validators.required],
        lastName: [user.last_name, Validators.required],
        email: [user.email, Validators.compose([Validators.required, Validators.email])],
        phone: [user.phone, Validators.compose([Validators.required])],
      });
    });
  }


  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}


