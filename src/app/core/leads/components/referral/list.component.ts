import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ReferralService} from '../../services/referral.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Referral} from '../../models/referral';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ReferralService, ModalFormService]
})
export class ListComponent extends GridComponent<Referral, ReferralService> implements OnInit {
  constructor(
    protected service$: ReferralService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-referral';
    this.name = 'lead-referral-list';
  }

  ngOnInit(): void {
    super.init();
  }

}
