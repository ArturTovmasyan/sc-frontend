import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {PhysicianSpecialityService} from '../../services/physician-speciality.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {PhysicianSpeciality} from '../../models/physician-speciality';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PhysicianSpecialityService]
})
export class ListComponent extends GridComponent<PhysicianSpeciality, PhysicianSpecialityService> implements OnInit {
  constructor(service$: PhysicianSpecialityService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'physician-speciality-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
