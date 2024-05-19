import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {UserInviteService} from '../../services/user-invite.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {UserInvite} from '../../../models/user-invite';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [UserInviteService, ModalFormService]
})
export class ListComponent extends GridComponent<UserInvite, UserInviteService> implements OnInit {
  constructor(
    protected service$: UserInviteService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-security-user_invite';
    this.name = 'user-invite-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
