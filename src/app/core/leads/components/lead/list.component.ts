import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {LeadService} from '../../services/lead.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FormComponent as ReportFormComponent} from './report-form/form.component';
import {Lead} from '../../models/lead';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {ReportService} from '../../../residents/services/report.service';
import {saveFile} from '../../../../shared/helpers/file-download-helper';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadService]
})
export class ListComponent extends GridComponent<Lead, LeadService> implements OnInit {
  constructor(
    protected service$: LeadService,
    protected report$: ReportService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

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

            this.params = [];
            this.reload_data(true);
          } else {
            this.buttons_right[0].name = 'open';
            this.buttons_right[0].faIcon = 'fas fa-star-half-alt';

            this.params = [];
            this.params.push({key: 'all', value: '1'});
            this.reload_data(true);
          }
        }
      }
    );
    this.buttons_center.push(
      {
        name: 'report',
        type: 'default',
        multiselect: false,
        free: true,
        nzIcon: null,
        faIcon: 'far fa-file',
        click: (ids: number[]) => {
          this.create_report_modal(this.modal$, ReportFormComponent, data => {
            this.loading = true;
            return this.report$.reportAsObservable('lead', 'lead', 'csv', {
              assessment_id: 1,
              date_from: data.date_from,
              date_to: data.date_to
            });
          }, data => {
            saveFile(data);
            this.loading = false;
          });
        }
      }
    );

    super.init();
  }

  protected create_report_modal(
    modal$: NzModalService,
    form_component: any,
    submit: (data: any) => Observable<any>,
    callback: (data: any) => any
  ) {
    let valid = false;
    let loading = false;

    const modal = modal$.create({
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
