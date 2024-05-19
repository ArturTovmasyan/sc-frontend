import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '../../../services/profile.service';
import {User} from '../../../models/user';

@Component({
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  user: User = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profile$: ProfileService) {
  }

  ngOnInit(): void {
    this.profile$.get().subscribe(user => this.user = user);
  }

}


