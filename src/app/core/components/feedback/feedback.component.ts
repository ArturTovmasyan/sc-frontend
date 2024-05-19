import {Component, Input} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../shared/components/abstract-form/abstract-form';
import {FormComponent} from './form/form.component';
import {FeedbackService} from '../../services/feedback.service';

@Component({
  selector: 'app-feedback',
  template: `<a [routerLink]="" (click)="show_modal()" style="color: white;">Contact Us</a>`,
})
export class FeedbackComponent {
  @Input('space') space: string;

  constructor(
    private feedback$: FeedbackService,
    private modal$: NzModalService
  ) {
  }

  show_modal(): void {
    this.create_modal(FormComponent, data => this.feedback$.add(data));
  }

  private create_modal(form_component: any, submit: (data: any) => Observable<any>) {
    let valid = false;
    let loading = false;

    const footer = [
      {
        label: 'Cancel',
        onClick: () => {
          modal.close();
        }
      },
      {
        type: 'primary',
        label: 'Send',
        loading: () => loading,
        disabled: () => !valid,
        onClick: () => {
          loading = true;

          const component = <AbstractForm>modal.getContentComponent();
          component.before_submit();
          const form_data = component.formValue();

          component.submitted = true;

          submit(form_data).subscribe(
            res => {
              loading = false;

              modal.close();
            },
            error => {
              loading = false;

              component.handleSubmitError(error);
              component.postSubmit(null);
              // console.error(error);
            });
        }
      },
    ];

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        const form = component.formObject;

        if (component instanceof FormComponent) {
          component.space = this.space;
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }
}
