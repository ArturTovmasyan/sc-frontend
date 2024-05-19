import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAssessmentService} from '../../../services/resident-assessment.service';
import {ResidentAssessment} from '../../../models/resident-assessment';
import {PhysicianService} from '../../../services/physician.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAssessmentService]
})
export class ListComponent extends GridComponent<ResidentAssessment, ResidentAssessmentService> implements OnInit {
  constructor(service$: ResidentAssessmentService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-assessment-list';
  }

  ngOnInit(): void {
    const resident_id = this.route$.snapshot.parent.params['id'];
    this.params.push({key: 'resident_id', value: resident_id});

    super.init();
  }
}
