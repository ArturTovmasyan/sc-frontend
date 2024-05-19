import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {PaymentSourceService} from '../../services/payment-source.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {PaymentSource} from '../../models/payment-source';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PaymentSourceService]
})
export class ListComponent extends GridComponent<PaymentSource, PaymentSourceService> implements OnInit {
  constructor(service$: PaymentSourceService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'payment-source-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
