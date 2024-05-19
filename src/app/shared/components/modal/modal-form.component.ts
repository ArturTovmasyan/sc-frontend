import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {Component, TemplateRef, Type, ViewChild} from '@angular/core';
import {AbstractForm} from '../abstract-form/abstract-form';
import {FormGroup} from '@angular/forms';
import {MessageComponent} from '../grid/message.component';

@Component({
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent {
  private loading: boolean;
  private valid: boolean;

  @ViewChild('modalFooter', {static: false}) modalFooter: TemplateRef<any>;
  private _component: Type<any>;

  private _preset_modal_form_data: (form: FormGroup) => void;
  private _modal_callback: (data: any) => void;

  set component(value: Type<any>) {
    this._component = value;
  }

  set preset_modal_form_data(value: (form: FormGroup) => void) {
    this._preset_modal_form_data = value;
  }

  set modal_callback(value: (data: any) => void) {
    this._modal_callback = value;
  }

  protected modal: NzModalRef<any>;

  private _without_save_and_add: boolean;

  set without_save_and_add(value: boolean) {
    this._without_save_and_add = value;
  }

  show_save_add: () => boolean;

  btn_save: () => void;
  btn_save_add: () => void;

  constructor(
    protected modal$: NzModalService
  ) {
    this.loading = false;
    this.valid = false;

    this._without_save_and_add = false;
  }

  public create(submit: (data: any) => Observable<any>, result: any, previous_data?: any) {
    this.btn_save = () => this.form_save(false, submit, result, previous_data);
    this.btn_save_add = () => this.form_save(true, submit, result, previous_data);
    this.show_save_add = (): boolean => (result === null && this._without_save_and_add === false);

    this.modal = this.modal$.create({
      nzNoAnimation: false,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: this._component,
      nzFooter: this.modalFooter
    });

    this.modal.afterOpen.subscribe(() => {
      const component = this.modal.getContentComponent();
      if (component instanceof AbstractForm) {
        const form = component.formObject;

        component.tabCountRecalculate();
        this.form_callback(form, component, result, previous_data);

        this.valid = form.valid;
        form.valueChanges.subscribe(val => this.valid = form.valid);
      }
    });
  }

  public create_remove_confirm(submit: (data: any) => Observable<any>, relation_count: number, data: any) {
    let loading = false;

    let modal_title = '';
    let modal_message = '';

    if (relation_count > 0) {
        modal_title = 'Attention!';
        modal_message = `This may cause other data loss from database. There are ${relation_count} connections found in database.`;
    }

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: MessageComponent,
      nzFooter: [
        {
          label: 'No',
          onClick: () => {
            modal.close();
          }
        },
        {
          type: 'danger',
          label: 'Yes',
          loading: () => loading,
          onClick: () => {
            loading = true;

            submit(data).subscribe(
              res => {
                loading = false;

                this._modal_callback(res);

                modal.close();
              },
              error => {
                loading = false;

                modal.close();

                this.modal$.error({nzTitle: 'Remove Error', nzContent: `${error.data.error}`});
              });
          }
        }
      ]
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof MessageComponent) {
        component.title = modal_title;
        component.message = modal_message;
      }
    });
  }

  btn_previous(): void {
    const component = this.modal.getContentComponent();
    if (component instanceof AbstractForm) {
      if (component.tabSelected.value > 0) {
        if (component.tabSelected.value > 0) {
          component.tabSelected.next(component.tabSelected.value - 1);
        }
      }
    }
  }

  btn_next(): void {
    const component = this.modal.getContentComponent();
    if (component instanceof AbstractForm) {
      if (component.tabSelected.value < component.tabCount) {
        component.tabSelected.next(component.tabSelected.value + 1);
      }
    }
  }

  btn_cancel(): void {
    this.modal.close();
  }

  show_previous(): boolean {
    const component = this.modal.getContentComponent();
    if (component instanceof AbstractForm) {
      component.tabCountRecalculate(); // TODO: review
      return component.tabCount > 0 && component.tabSelected.value > 0;
    }
    return false;
  }

  show_next(): boolean {
    const component = this.modal.getContentComponent();
    if (component instanceof AbstractForm) {
      component.tabCountRecalculate(); // TODO: review
      return component.tabCount > 0 && component.tabSelected.value < (component.tabCount - 1);
    }
    return false;
  }

  show_save_loading(): boolean {
    return this.loading;
  }

  show_save_disabled(): boolean {
    return !this.valid;
  }

  protected form_save(reopen: boolean, submit: (data: any) => Observable<any>, result: any, previous_data?: any) {
    this.loading = true;

    const component = this.modal.getContentComponent();
    if (component instanceof AbstractForm) {
      component.before_submit();

      const form_data = component.formObject.value;
      component.submitted = true;

      submit(form_data).subscribe(
        res => {
          this.loading = false;

          this._modal_callback(res);
          component.after_submit();

          this.modal.close();

          if (reopen) {
            this.create(submit, result, form_data);
          }
        },
        error => {
          this.loading = false;

          component.handleSubmitError(error);
          component.postSubmit(null);
          // console.error(error);
        });
    }
  }

  protected form_callback(form: FormGroup, component: AbstractForm, result: any, previous_data ?: any): void {
    if (this._preset_modal_form_data) {
      this._preset_modal_form_data(form);
    }

    component.edit_mode = result !== null;
    if (component.edit_mode) {
      component.before_set_form_data(result);
      component.set_form_data(component, form, result);
      component.after_set_form_data();
    } else {
      component.before_set_form_data(null, previous_data); // TODO: review
    }
  }

}
