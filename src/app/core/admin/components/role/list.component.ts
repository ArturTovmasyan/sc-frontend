import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {RoleService} from '../../services/role.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Role} from '../../../models/role';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [RoleService, ModalFormService]
})
export class ListComponent extends GridComponent<Role, RoleService> implements OnInit {
  constructor(
    protected service$: RoleService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-security-role';
    this.name = 'role-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
