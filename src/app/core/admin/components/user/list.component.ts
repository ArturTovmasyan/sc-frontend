import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {UserService} from '../../services/user.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {User} from '../../../models/user';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [UserService, ModalFormService]
})
export class ListComponent extends GridComponent<User, UserService> implements OnInit {
  constructor(
    protected service$: UserService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-security-user';
    this.name = 'user-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
