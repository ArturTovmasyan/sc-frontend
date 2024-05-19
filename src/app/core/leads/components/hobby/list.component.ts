import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {HobbyService} from '../../services/hobby.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Hobby} from '../../models/hobby';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [HobbyService, ModalFormService]
})
export class ListComponent extends GridComponent<Hobby, HobbyService> implements OnInit {
  constructor(
    protected service$: HobbyService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-hobby';
    this.name = 'lead-hobby-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
