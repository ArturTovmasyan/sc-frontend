import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {PhysicianSpecialityService} from '../../services/physician-speciality.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {PhysicianSpeciality} from '../../models/physician-speciality';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PhysicianSpecialityService, ModalFormService]
})
export class ListComponent extends GridComponent<PhysicianSpeciality, PhysicianSpecialityService> implements OnInit {
  constructor(
    protected service$: PhysicianSpecialityService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-speciality';
    this.name = 'physician-speciality-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
