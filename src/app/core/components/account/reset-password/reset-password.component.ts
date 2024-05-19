import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../../services/account.service';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {CoreValidator} from '../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../default-layout/default-layout.component.scss']
})
export class ResetPasswordComponent extends AbstractForm implements OnInit {
  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private account$: AccountService
  ) {
    super(modal$);

    this.submit = (data: any) => {
      return this.account$.resetPassword(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = 'Your password has been successfully updated.';
      this.disabled = true;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hash: [this.route.snapshot.queryParamMap.get('key'), Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, CoreValidator.password])],
      re_password: ['', Validators.compose([Validators.required, CoreValidator.match_other('password', 'new password')])]
    });
  }

}


