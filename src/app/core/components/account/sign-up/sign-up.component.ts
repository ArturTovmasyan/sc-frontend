import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../../services/account.service';
import {Message} from '../../../models/message';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {CoreValidator} from '../../../../shared/utils/core-validator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../default-layout/default-layout.component.scss']
})
export class SignUpComponent extends AbstractForm implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private account$: AccountService) {
    super();

    this.submit = (data: any) => {
      return this.account$.signup(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = 'Your account have been successfully created. You will receive confirmation e-mail soon.';
      this.disabled = true;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      organization: ['', Validators.compose([CoreValidator.notEmpty])],
      first_name: ['', Validators.compose([CoreValidator.notEmpty])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, CoreValidator.phone])],
      password: ['', Validators.compose([Validators.required, CoreValidator.password])],
      re_password: ['', Validators.compose([Validators.required, CoreValidator.match_other('password', 'password')])]
    });
  }

}


