import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/auth.service';

@Component({templateUrl: './logout.component.html'})
export class LogoutComponent implements OnInit {
  error: string;

  constructor(private auth$: AuthenticationService) {
  }

  ngOnInit() {
    this.auth$.logout();
  }

}
