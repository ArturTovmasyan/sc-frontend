import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {WebEmailService} from '../../services/web-email.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {WebEmail} from '../../models/web-email';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [WebEmailService, ModalFormService]
})
export class ListComponent extends GridComponent<WebEmail, WebEmailService> implements OnInit {
  constructor(
    protected service$: WebEmailService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-web_email';
    this.name = 'lead-web-email-list';

    this.grid_options_loaded.subscribe(next => {
      if (next) {
        const btn = this._btnBar.buttons_crud.filter(v => v.name === 'add').pop();

        if (btn) {
          btn.show = false; // TODO: review
        }
      }
    });
  }

  ngOnInit(): void {
    super.init();
  }
}
