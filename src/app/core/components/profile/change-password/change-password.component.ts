import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';
import {CoreValidator} from '../../../../shared/utils/core-validator';

@Component({
  templateUrl: './change-password.component.html'
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
      this.message = 'Your password has been successfully changed.';
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      new_password: ['', Validators.compose([Validators.required, CoreValidator.password])],
      re_new_password: ['', Validators.compose([Validators.required, CoreValidator.match_other('new_password', 'new password')])]
    });
  }

}

