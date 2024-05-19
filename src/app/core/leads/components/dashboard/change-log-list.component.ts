import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../services/title.service';
import {FormComponent} from '../activity/form/form.component';
import {ChangeLogService} from '../../../admin/services/change-log.service';
import {ChangeLog} from '../../../models/change-log';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard-change-log',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ChangeLogService, ModalFormService]
})
export class ListComponent extends GridComponent<ChangeLog, ChangeLogService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: ChangeLogService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-common-change_log';
    this.name = 'lead-change-log-list';

    this.grid_options_loaded.subscribe(next => {
      if (next) {
        const add_btn = this._btnBar.buttons_crud.filter(v => v.name === 'add').pop();
        const edit_btn = this._btnBar.buttons_crud.filter(v => v.name === 'edit').pop();
        const remove_btn = this._btnBar.buttons_crud.filter(v => v.name === 'remove').pop();

        if (add_btn) {
          add_btn.show = false; // TODO: review
        }

        if (edit_btn) {
          edit_btn.show = false; // TODO: review
        }

        if (remove_btn) {
          remove_btn.show = true; // TODO: review
        }
      }
    });
  }

  ngOnInit(): void {
    this.params.push({key: 'my', value: '1'});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      // form.get('owner_type').setValue(ChangeLogOwnerType.REFERRAL);
      // form.get('referral_id').setValue(this.referral_id);
    };
  }
}
