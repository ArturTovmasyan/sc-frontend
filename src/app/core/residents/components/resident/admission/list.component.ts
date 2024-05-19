import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAdmission} from '../../../models/resident-admission';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAdmissionService]
})
export class ListComponent extends GridComponent<ResidentAdmission, ResidentAdmissionService> implements OnInit {
  constructor(service$: ResidentAdmissionService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-admission-list';
  }

  ngOnInit(): void {
    const resident_id = this.route$.snapshot.parent.params['id'];
    this.params.push({key: 'resident_id', value: resident_id});

    super.init();
  }
}
