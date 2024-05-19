import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ActivityService} from '../../services/activity.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Activity} from '../../models/activity';
import {ActivatedRoute} from '@angular/router';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityService, ModalFormService]
})
export class ListComponent extends GridComponent<Activity, ActivityService> implements OnInit {
  constructor(
    protected service$: ActivityService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private route$: ActivatedRoute
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-activity';
    this.name = 'lead-activity-list';

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
    if (this.route$.snapshot.url[0].path === 'my') {
      this.params.push({key: 'my', value: '1'});
    }

    super.init();
  }

}
