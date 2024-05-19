import * as _ from 'lodash';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Document} from '../../models/document';
import {TitleService} from '../../../services/title.service';
import {DocumentService} from '../../services/document.service';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthGuard} from '../../../guards/auth.guard';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {FormComponent} from '../form/form.component';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  documents: Document[];
  document: Document;

  loading: boolean;
  loading_edit_modal: boolean;

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private title$: TitleService,
    private modal$: NzModalService,
    private service$: DocumentService,
    private sanitizer: DomSanitizer,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};

    this.document = null;
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('list_document');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'title':
        this.$subscriptions[key] = this.title$.getTitle().subscribe(v => this.title = v);
        break;
      case 'list_document':
        this.document = null;
        this.loading = true;
        this.$subscriptions[key] = this.service$.all().subscribe(res => {
          if (res) {
            this.loading = false;
            this.documents = res;

            this.documents.sort((a, b) => a.title.localeCompare(b.title));

            if (params) {
              this.document = this.documents.filter(v => v.id = params.document_id).pop();
            } else {
              this.document = this.documents[0];
            }
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

  public openPDF(document: Document) {
    this.document = document;
  }

  addIfHasPermission(permission: string, level: number) {
    return this.auth_$.checkPermission([permission], level);
  }

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.service$.add(data), null);
  }

  show_modal_edit(): void {
    this.loading_edit_modal = true;
    this.service$.get(this.document.id).subscribe(
      res => {
        this.loading_edit_modal = false;

        this.create_modal(FormComponent, data => this.service$.edit(data), res);
      },
      error => {
        this.loading_edit_modal = false;
        // console.error(error);
      });
  }

  show_modal_remove(): void {
    let loading = false;
    this.service$.relatedInfo([this.document.id]).subscribe(value => {
      if (value) {
        let modal_title = '';
        let modal_message = '';

        if (_.isArray(value) && value.length > 0) {
          value = Object.keys(value[0])
            .reduce((previousValue, currentValue, currentIndex) => (previousValue + value[0][currentValue].sum), 0);

          if (value > 0) {
            modal_title = 'Attention!';
            modal_message = `This may cause other data loss from database. There are ${value} connections found in database.`;
          }
        }

        const modal = this.modal$.create({
          nzClosable: false,
          nzMaskClosable: false,
          nzTitle: null,
          nzContent: `<p class="modal-confirm text-center">
                    <i class="fa fa-warning text-danger"></i>
                     Are you sure you want to <strong>delete</strong> selected record(s)?
                     </p>`,
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
                this.service$.removeBulk([this.document.id]).subscribe(
                  res => {
                    loading = false;

                    this.subscribe('list_document');

                    modal.close();
                  },
                  error => {
                    loading = false;
                    modal.close();

                    this.modal$.error({
                      nzTitle: 'Remove Error',
                      nzContent: `${error.data.error}`
                    });

                    // console.error(error);
                  });
              }
            }
          ]
        });
      }
    });
  }

  private create_modal(form_component: any, submit: (data: any) => Observable<any>, result: any) {
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

              if (res != null && Array.isArray(res) && res.length === 1) {
                this.subscribe('list_document', {document_id: res[0]});
              } else {
                this.subscribe('list_document', {document_id: this.document.id});
              }

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

    if (result === null) {
      footer.push({
        type: 'primary',
        label: 'Save & Add',
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

              if (res != null && Array.isArray(res) && res.length === 1) {
                this.subscribe('list_document', {document_id: res[0]});
              } else {
                this.subscribe('list_document', {document_id: this.document.id});
              }

              modal.close();

              this.create_modal(form_component, submit, result);
            },
            error => {
              loading = false;

              component.handleSubmitError(error);
              component.postSubmit(null);
              // console.error(error);
            });
        }
      });
    }

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
      if (component instanceof FormComponent) {
        const form = component.formObject;

        if (result !== null) {
          component.loaded.subscribe(v => {
            if (v) {
              component.before_set_form_data(result);
              component.set_form_data(component, form, result);
              component.after_set_form_data();
            }
          });
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

}
