import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AccountService} from '../../../services/account.service';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './activate.component.html',
  styleUrls: ['../../default-layout/default-layout.component.scss']
})
export class ActivateComponent extends AbstractForm implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private account$: AccountService) {
    super();

    this.submit = (data: any) => {
      return this.account$.activate(data);
    };

    this.postSubmit = (data: Message) => {
      this.message = 'Your account has been successfully activation.';
      this.disabled = true;
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hash: [this.route.snapshot.queryParamMap.get('key'), Validators.compose([Validators.required])],
    });

    this.submitForm();
  }

}


