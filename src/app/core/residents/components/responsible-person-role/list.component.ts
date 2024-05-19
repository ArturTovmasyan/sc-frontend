import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ResponsiblePersonRoleService} from '../../services/responsible-person-role.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResponsiblePersonRole} from '../../models/responsible-person-role';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResponsiblePersonRoleService, ModalFormService]
})
export class ListComponent extends GridComponent<ResponsiblePersonRole, ResponsiblePersonRoleService> implements OnInit {
  constructor(
    protected service$: ResponsiblePersonRoleService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-responsible-person-role';
    this.name = 'responsible-person-role-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
