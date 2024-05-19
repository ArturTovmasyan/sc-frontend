import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../../services/account.service';
import {Message} from '../../../models/message';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {CoreValidator} from '../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './invitation.component.html',
  styleUrls: ['../../default-layout/default-layout.component.scss']
})
export class InvitationComponent extends AbstractForm implements OnInit {
  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private account$: AccountService
  ) {
    super(modal$);

    this.submit = (data: any) => {
      return this.account$.accept(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = 'Your account have been successfully created. You can sign in using your credentials.';
      this.disabled = true;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      token: [this.route.snapshot.queryParamMap.get('key'), Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([CoreValidator.notEmpty])],
      last_name: ['', Validators.compose([CoreValidator.notEmpty])],
      phone: ['', Validators.compose([Validators.required, CoreValidator.phone])],
      password: ['', Validators.compose([Validators.required, CoreValidator.password])],
      re_password: ['', Validators.compose([Validators.required, CoreValidator.match_other('password', 'password')])]
    });
  }

}


