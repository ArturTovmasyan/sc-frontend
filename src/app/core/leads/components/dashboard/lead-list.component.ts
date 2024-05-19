import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {LeadService} from '../../services/lead.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from '../lead/form/form.component';
import {Lead} from '../../models/lead';

@Component({
  selector: 'app-dashboard-lead',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadService]
})
export class ListComponent extends GridComponent<Lead, LeadService> implements OnInit {
  constructor(
    protected service$: LeadService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'lead-lead-list';
  }

  ngOnInit(): void {
    this.buttons_right.push(
      {
        name: 'all',
        type: 'default',
        multiselect: false,
        free: true,
        nzIcon: null,
        faIcon: 'fas fa-star',
        click: (ids: number[]) => {
          if (this.buttons_right[0].name === 'open') {
            this.buttons_right[0].name = 'all';
            this.buttons_right[0].faIcon = 'fas fa-star';

            this.params = [{key: 'my', value: '1'}];
            this.reload_data(true);
          } else {
            this.buttons_right[0].name = 'open';
            this.buttons_right[0].faIcon = 'fas fa-star-half-alt';

            this.params = [{key: 'my', value: '1'}];
            this.params.push({key: 'all', value: '1'});
            this.reload_data(true);
          }
        }
      }
    );

    this.params.push({key: 'my', value: '1'});

    super.init();
  }

}
