import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {LeadService} from '../../services/lead.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from '../lead/form/form.component';
import {Lead} from '../../models/lead';
import {ModalFormService} from '../../../../shared/services/modal-form.service';
import {Button, ButtonMode} from '../../../../shared/components/modal/button-bar.component';
import {FormComponent as ReportFormComponent} from '../lead/report-form/form.component';
import {saveFile} from '../../../../shared/helpers/file-download-helper';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {NzModalService} from 'ng-zorro-antd';
import {ReportService} from '../../../residents/services/report.service';

@Component({
  selector: 'app-dashboard-lead',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [LeadService, ModalFormService]
})
export class ListComponent extends GridComponent<Lead, LeadService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: LeadService,
    protected report$: ReportService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private nzModal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-lead-lead';
    this.name = 'lead-lead-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'my', value: '1'});

    super.init();
  }

  ngAfterViewInit(): void {
    this.add_button_center(new Button(
      'report',
      'grid.lead-lead-list.button.report',
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'far fa-file',
      false,
      true,
      () => {
        this.create_report_modal(ReportFormComponent, data => {
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
      }));

    this.add_button_right(new Button(
      'all',
      'grid.lead-lead-list.button.all',
      'default',
      ButtonMode.FREE_SELECT,
      null,
      'fas fa-star',
      false,
      true,
      () => {
        const btn = this._btnBar.buttons_right[0];

        this.params = [{key: 'my', value: '1'}];
        if (btn.name === 'all') {
          this.params.push({key: 'all', value: '1'});
        }
        this.reload_data(true);

        btn.faIcon = btn.name === 'open' ? 'fas fa-star' : 'fas fa-star-half-alt';
        btn.title = btn.name === 'open' ? 'grid.lead-lead-list.button.all' : 'grid.lead-lead-list.button.open';
        btn.name = btn.name === 'open' ? 'all' : 'open';
      }));


    this.add_button_right(new Button(
      'spam',
      'grid.lead-lead-list.button.spam',
      'default',
      ButtonMode.FREE_SELECT,
      'file-exclamation',
      null,
      false,
      true,
      () => {
        const btn = this._btnBar.buttons_right[1];

        this.params = [{key: 'my', value: '1'}];
        if (btn.name === 'spam') {
          this.params.push({key: 'spam', value: '1'});
        }
        this.reload_data(true);

        btn.name = btn.name === 'spam' ? 'not_spam' : 'spam';
        btn.nzIcon = btn.name === 'spam' ? 'file-exclamation' : 'file-done';
        btn.title = btn.name === 'not_spam' ? 'grid.lead-lead-list.button.not_spam' : 'grid.lead-lead-list.button.spam';
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
