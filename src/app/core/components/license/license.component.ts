import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ProfileService} from '../../services/profile.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
})
export class LicenseComponent {
  @Input('showModal') showModal: boolean;

  constructor(
    private profile$: ProfileService,
    private router$: Router
  ) {
  }

  accept() {
    this.profile$.accept().subscribe(res => {
      this.showModal = false;
    });
  }

  decline() {
    this.profile$.decline().subscribe(res => {
      this.showModal = false;
      this.router$.navigate(['/sign-out']);
    });
  }
}
