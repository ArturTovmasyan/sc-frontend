import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAllergyOtherService} from '../../../../services/resident-allergy-other.service';
import {ResidentAllergyOther} from '../../../../models/resident-allergy-other';

@Component({
  selector: 'app-resident-history-allergy-other',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAllergyOtherService]
})
export class ListComponent extends GridComponent<ResidentAllergyOther, ResidentAllergyOtherService> implements OnInit {
  constructor(service$: ResidentAllergyOtherService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-allergy-other-list';
  }

  ngOnInit(): void {
    const resident_id = this.route$.snapshot.parent.params['id'];
    this.params.push({key: 'resident_id', value: resident_id});

    super.init();
  }
}
