import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentResponsiblePersonService} from '../../../services/resident-responsible-person.service';
import {ResidentResponsiblePerson} from '../../../models/resident-responsible-person';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentResponsiblePersonService]
})
export class ListComponent extends GridComponent<ResidentResponsiblePerson, ResidentResponsiblePersonService> {
  constructor(service$: ResidentResponsiblePersonService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-responsible-person-list';
  }
}
