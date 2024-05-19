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
  styleUrls: ['./sign-up.component.scss']
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
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(CoreValidator.Patterns.PHONE)])],
      password: ['', Validators.required],
      rePassword: ['', Validators.required, /** TODO: Validation service match*/]
    });
  }

}


