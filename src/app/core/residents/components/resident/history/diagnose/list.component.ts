import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentDiagnoseService} from '../../../../services/resident-diagnose.service';
import {ResidentDiagnose} from '../../../../models/resident-diagnose';

@Component({
  selector: 'app-resident-history-diagnose',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentDiagnoseService]
})
export class ListComponent extends GridComponent<ResidentDiagnose, ResidentDiagnoseService> implements OnInit {
  constructor(service$: ResidentDiagnoseService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-diagnoses-list';
  }

  ngOnInit(): void {
    const resident_id = this.route$.snapshot.parent.params['id'];
    this.params.push({key: 'resident_id', value: resident_id});

    super.init();
  }
}
