import {Component} from '@angular/core';
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
export class ListComponent extends GridComponent<ResidentAllergyOther, ResidentAllergyOtherService> {
  constructor(service$: ResidentAllergyOtherService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'allergy-other-list';
  }
}
