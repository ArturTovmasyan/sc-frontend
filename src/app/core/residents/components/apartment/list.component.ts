import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ApartmentService} from '../../services/apartment.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Apartment} from '../../models/apartment';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ApartmentService]
})
export class ListComponent extends GridComponent<Apartment, ApartmentService> implements OnInit {
  constructor(service$: ApartmentService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'apartment-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
