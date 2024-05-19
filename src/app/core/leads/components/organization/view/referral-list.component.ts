import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {ReferralService} from '../../../services/referral.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {Referral} from '../../../models/referral';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../../referral/form/form.component';
import {ActivityOwnerType} from '../../../models/activity';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-lead-organization-referral',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ReferralService]
})
export class ListComponent extends GridComponent<Referral, ReferralService> implements OnInit {
  @Input() organization_id: Number = -1;

  constructor(
    protected service$: ReferralService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'lead-referral-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'organization_id', value: this.organization_id.toString()});

    super.init();
  }

  protected preset_modal_form_data(form: FormGroup) {
    form.get('organization_id').setValue(this.organization_id);
  }
}
