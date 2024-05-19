import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends AbstractForm implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profile$: ProfileService) {
    super();

    this.submit = (data: any) => {
      return this.profile$.changePassword(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = data.message;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      reNewPassword: ['', Validators.required, /** Validation service match*/]
    });
  }

}


