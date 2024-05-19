import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ActivityService} from '../../services/activity.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Activity} from '../../models/activity';
import {FormComponent as ReportFormComponent} from './report-form/form.component';
import {saveFile} from '../../../../shared/helpers/file-download-helper';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {ReportService} from '../../../residents/services/report.service';
import {ActivatedRoute} from '@angular/router';
import {ModalFormService} from '../../../../shared/services/modal-form.service';
import {Button, ButtonMode} from '../../../../shared/components/modal/button-bar.component';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityService, ModalFormService]
})
export class ListComponent extends GridComponent<Activity, ActivityService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: ActivityService,
    protected report$: ReportService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    protected nzModal$: NzModalService,
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

  ngAfterViewInit(): void {
    this.add_button_center(new Button(
      'report',
      'grid.lead-activity-list.button.report',
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'far fa-file',
      false,
      true,
      () => {
        this.create_report_modal(ReportFormComponent, data => {
          this.loading = true;
          return this.report$.reportAsObservable('lead', 'activity', 'csv', {
            assessment_id: 1,
            date_from: data.date_from,
            date_to: data.date_to
          });
        }, data => {
          saveFile(data);
          this.loading = false;
        });
      }));
  }

  protected create_report_modal(
    form_component: any,
    submit: (data: any) => Observable<any>,
    callback: (data: any) => any
  ) {
    let valid = false;
    let loading = false;

    const modal = this.nzModal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: form_component,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => {
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Save',
          loading: () => loading,
          disabled: () => !valid,
          onClick: () => {
            loading = true;

            const component = <AbstractForm>modal.getContentComponent();
            component.before_submit();
            const form_data = component.formObject.value;

            component.submitted = true;

            submit(form_data).subscribe(
              res => {
                loading = false;

                callback(res);

                modal.close();
              },
              error => {
                loading = false;

                component.handleSubmitError(error);
                component.postSubmit(null);
              });
          }
        }
      ]
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        const form = component.formObject;

        component.edit_mode = false;
        component.before_set_form_data(null); // review

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }
}
