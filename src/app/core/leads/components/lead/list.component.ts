import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {LeadService} from '../../services/lead.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Lead} from '../../models/lead';
import {ModalFormService} from '../../../../shared/services/modal-form.service';
import {Button, ButtonMode} from '../../../../shared/components/modal/button-bar.component';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadService, ModalFormService]
})
export class ListComponent extends GridComponent<Lead, LeadService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: LeadService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-lead';
    this.name = 'lead-lead-list';
  }

  ngOnInit(): void {
    super.init();
  }

  ngAfterViewInit(): void {
    this.add_button_right(new Button(
      'open',
      'grid.lead-lead-list.button.open',
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'fas fa-star-half-alt',
      false,
      true,
      () => {
          const btn = this._btnBar.buttons_right[0];

          this.params = [];
          if (btn.name === 'open') {
              this.params.push({key: 'open', value: '1'});
          }

          this.reload_data(true);
      }));

    this.add_button_right(new Button(
      'closed',
      'grid.lead-lead-list.button.closed',
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'fas fa-star-half-alt',
      false,
      true,
      () => {
          const btn = this._btnBar.buttons_right[1];

          this.params = [];
          if (btn.name === 'closed') {
              this.params.push({key: 'closed', value: '1'});
          }

          this.reload_data(true);
      }));

    this.add_button_right(new Button(
      'both',
      'grid.lead-lead-list.button.both',
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'fas fa-star',
      false,
      true,
      () => {
          const btn = this._btnBar.buttons_right[2];

          this.params = [];
          if (btn.name === 'both') {
              this.params.push({key: 'both', value: '1'});
          }

          this.reload_data(true);
      }));

    // this.add_button_right(new Button(
      // 'spam',
      // 'grid.lead-lead-list.button.spam',
      // 'default',
      // ButtonMode.FREE_SELECT,
      // 'file-exclamation',
      // null,
      // false,
      // true,
      // () => {
      //   const btn = this._btnBar.buttons_right[4];
      //
      //   this.params = [];
      //   if (btn.name === 'spam') {
      //     this.params.push({key: 'spam', value: '1'});
      //   }
      //   this.reload_data(true);
      //
      //   btn.name = btn.name === 'spam' ? 'not_spam' : 'spam';
      //   btn.nzIcon = btn.name === 'spam' ? 'file-exclamation' : 'file-done';
      //   btn.title = btn.name === 'not_spam' ? 'grid.lead-lead-list.button.not_spam' : 'grid.lead-lead-list.button.spam';
      // }));
  }
}
