import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ReferralService} from '../../../services/referral.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {Referral} from '../../../models/referral';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../../referral/form/form.component';
import {FormGroup} from '@angular/forms';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-lead-organization-referral',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ReferralService, ModalFormService]
})
export class ListComponent extends GridComponent<Referral, ReferralService> implements OnInit, AfterViewInit {
  @Input() organization_id: number = -1;

  constructor(
    protected service$: ReferralService,
    protected title$: TitleService,
    protected modal$: ModalFormService
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

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('organization_id').setValue(this.organization_id);
    };
  }

}
