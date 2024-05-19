import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentMedicalHistoryService} from '../../../../services/resident-medical-history.service';
import {ResidentMedicalHistory} from '../../../../models/resident-medical-history';

@Component({
  selector: 'app-resident-history-medical-history',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentMedicalHistoryService]
})
export class ListComponent extends GridComponent<ResidentMedicalHistory, ResidentMedicalHistoryService> implements OnInit {
  constructor(service$: ResidentMedicalHistoryService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-medical-history-list';
  }

  ngOnInit(): void {
    const resident_id = this.route$.snapshot.parent.params['id'];
    this.params.push({key: 'resident_id', value: resident_id});

    super.init();
  }
}
