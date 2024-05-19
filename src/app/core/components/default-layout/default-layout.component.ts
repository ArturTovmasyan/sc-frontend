import {Component} from '@angular/core';
import {navItems} from '../../_nav';
import {User} from '../../models/user';
import {ProfileService} from '../../services/profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  public user: User;

  constructor(private profile$: ProfileService) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

    this.profile$.get().subscribe(user => this.user = user);
  }
}
