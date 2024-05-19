import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from '../../../services/report.service';
import {TitleService} from '../../../../services/title.service';
import {KeyValue} from '@angular/common';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ModalButtonOptions, NzModalService} from 'ng-zorro-antd';
import {FormComponent} from './form/form.component';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
  protected title: string = null;
  public reports = null;
  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private report$: ReportService,
    private title$: TitleService,
    protected modal$: NzModalService
  ) {
    this.title$.getTitle().subscribe(v => this.title = v);

    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('list_report');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_report':
        this.$subscriptions[key] = this.report$.list().pipe(first()).subscribe(res => {
          if (res) {
            this.reports = res;
          }
        });
        break;
      default:
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }

  show_modal_report(group_alias, report_alias, report_config) {
    this.create_modal(FormComponent, group_alias, report_alias, report_config);
  }

  private create_modal(form_component: any, group_alias: string, report_alias: string, result: any) {
    let valid = false;

    const loading = Array(result.formats.length);

    const footer_config: Array<ModalButtonOptions<any>> = [];

    footer_config.push({
      label: 'Cancel',
      onClick: () => {
        modal.close();
      }
    });

    result.formats.forEach((format, idx) => {
      loading[idx] = false;
      footer_config.push({
        type: 'primary',
        label: format.toUpperCase(),
        loading: () => loading[idx],
        disabled: () => !valid,
        onClick: () => {
          loading[idx] = true;

          const component = <AbstractForm>modal.getContentComponent();
          const form_data = component.formObject.value;

          component.submitted = true;

          this.report$.report(group_alias, report_alias, format, form_data, () => {
            loading[idx] = false;
            modal.close();
          }, (error) => {
            loading[idx] = false;
            component.handleSubmitError(error);
            component.postSubmit(null);
          });
        }
      });
    });

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer_config
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof FormComponent) {
        component.init_report_parameters(result.title, result.parameters);

        const form = component.formObject;

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

}
