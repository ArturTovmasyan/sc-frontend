import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/auth.service';

@Component({templateUrl: './sign-out.component.html'})
export class SignOutComponent implements OnInit {
  error: string;

  constructor(private auth$: AuthenticationService) {
  }

  ngOnInit() {
    this.auth$.sign_out();
  }

}
