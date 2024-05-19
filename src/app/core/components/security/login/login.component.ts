import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../services/auth.service';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {Message} from '../../../models/message';
import {ProfileService} from '../../../services/profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AbstractForm implements OnInit {
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth$: AuthenticationService,
    private profile$: ProfileService) {
    super();

    this.submit = (data: any) => {
      return this.auth$.login(data);
    };

    this.postSubmit = (data: Message) => {
      profile$.get().subscribe(user => {
          user.roles = ['ROLE_ADMIN'];
          localStorage.setItem('user', btoa(JSON.stringify(user)));
          this.router.navigate([this.returnUrl]);
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

    // reset login status
    // this.auth$.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
}


