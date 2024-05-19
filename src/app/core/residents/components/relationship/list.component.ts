import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {RelationshipService} from '../../services/relationship.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Relationship} from '../../models/relationship';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [RelationshipService]
})
export class ListComponent extends GridComponent<Relationship, RelationshipService> implements OnInit {
  constructor(
    protected service$: RelationshipService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'relationship-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
