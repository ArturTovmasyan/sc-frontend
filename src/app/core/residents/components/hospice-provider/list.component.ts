import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {HospiceProviderService} from '../../services/hospice-provider.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {HospiceProvider} from '../../models/hospice-provider';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [HospiceProviderService, ModalFormService]
})
export class ListComponent extends GridComponent<HospiceProvider, HospiceProviderService> implements OnInit {
  constructor(
    protected service$: HospiceProviderService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-hospice_provider';
    this.name = 'hospice-provider-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
