import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../../services/account.service';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../default-layout/default-layout.component.scss']
})
export class ForgotPasswordComponent extends AbstractForm implements OnInit {
  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private account$: AccountService
  ) {
    super(modal$);

    this.submit = (data: any) => {
      return this.account$.forgotPassword(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = data.message;
      this.disabled = true;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

}


