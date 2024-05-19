import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {ReportService} from '../../../services/report.service';
import {TitleService} from '../../../../services/title.service';
import {KeyValue} from '@angular/common';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ModalButtonOptions, NzModalService} from 'ng-zorro-antd';
import {FormComponent} from './form/form.component';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  public title: string = null;

  resident_id: number;

  reports = null;

  constructor(
    private el: ElementRef,
    private report$: ReportService,
    private title$: TitleService,
    protected modal$: NzModalService,
    private route$: ActivatedRoute
  ) {
    title$.getTitle().subscribe(v => this.title = v);
  }

  ngOnInit(): void {
    this.resident_id = this.route$.snapshot.parent.params['id'];

    this.report$.list().pipe(first()).subscribe(res => {
      if (res) {
        this.reports = res;
      }
    });
  }

  no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }

  show_modal_report(group_alias, report_alias, report_config) {
    this.create_modal(FormComponent, group_alias, report_alias, report_config);
  }

  private create_modal(form_component: any, group_alias: string, report_alias: string, result: any) {
    let valid = false;

    let loading = Array(result.formats.length);

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
        component.init_report_parameters(result.parameters);

        const form = component.formObject;

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

}
