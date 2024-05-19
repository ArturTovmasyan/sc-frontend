import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ResponsiblePersonService} from '../../services/responsible-person.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResponsiblePerson} from '../../models/responsible-person';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResponsiblePersonService]
})
export class ListComponent extends GridComponent<ResponsiblePerson, ResponsiblePersonService> implements OnInit {
  constructor(
    protected service$: ResponsiblePersonService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'responsible-person-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
