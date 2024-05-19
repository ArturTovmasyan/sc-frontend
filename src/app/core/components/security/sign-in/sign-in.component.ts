import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../services/auth.service';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../../default-layout/default-layout.component.scss']
})
export class SignInComponent extends AbstractForm implements OnInit {
  returnUrl: string;

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth$: AuthenticationService,
    private profile$: ProfileService
  ) {
    super(modal$);

    this.submit = (data: any) => {
      return this.auth$.sign_in(data);
    };

    this.postSubmit = (data: Message) => {
      profile$.me().subscribe(user => {
          localStorage.setItem('user', btoa(JSON.stringify(user)));
          this.router.navigateByUrl(this.returnUrl);
        }
      );
    };
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [true]
    });

    // reset sign_in status
    // this.auth$.sign_out();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
}


