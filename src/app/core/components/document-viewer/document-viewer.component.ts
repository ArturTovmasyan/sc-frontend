import * as _ from 'lodash';
import * as PDFObject from 'pdfobject';
import {DomSanitizer} from '@angular/platform-browser';
import {Component, Input, OnDestroy, OnInit, Type} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {TitleService} from '../../services/title.service';
import {Category as DocumentCategory} from '../../documents/models/category';
import {CategoryService as DocumentCategoryService} from '../../documents/services/category.service';
import {AuthGuard} from '../../guards/auth.guard';
import {GridService} from '../../../shared/services/grid.service';
import {Document} from '../../documents/models/document';
import {FacilityDocument} from '../../residents/models/facility-document';
import {ResidentDocument} from '../../residents/models/resident-document';
import {AbstractForm} from '../../../shared/components/abstract-form/abstract-form';
import {FormComponent as DocumentFormComponent} from '../../documents/components/document/form/form.component';
import {FormComponent as FacilityDocumentFormComponent} from '../../residents/components/facility-document/form/form.component';
import {FormComponent as ResidentDocumentFormComponent} from '../../residents/components/resident/document/form/form.component';

@Component({
  selector:  'app-document-viewer',
  templateUrl: './document-viewer.component.html'
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  private _service$: GridService<any>;

  @Input('component') component: Type<any>;

  @Input('show-category') show_category: boolean;

  @Input('service') set service(value: GridService<any>) {
    this._service$ = value;
  }

  @Input('resident-id') resident_id: number;

  @Input('title') title: string;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  categories: DocumentCategory[];
  category: DocumentCategory;

  documents: Document[] | FacilityDocument[] | ResidentDocument[];
  document: Document | FacilityDocument | ResidentDocument;

  loading: boolean;
  loading_edit_modal: boolean;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private title$: TitleService,
    private modal$: NzModalService,
    private category$: DocumentCategoryService,
    private sanitizer: DomSanitizer,
    private route$: ActivatedRoute,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};

    this.document = null;
    this.category = null;

    this.show_category = true;
    this.resident_id = null;
    this.title = null;
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('param_id');

    if (this.show_category) {
      this.subscribe('list_category');
    }
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'title':
        this.$subscriptions[key] = this.title$.getTitle().subscribe(v => {
          if (this.title === null) {
            this.title = v;
          }
        });
        break;
      case 'param_id':
        this.$subscriptions[key] = this.route$.queryParamMap.subscribe(route_params => {
          if (route_params.has('id')) {
            this.subscribe('list_document', {document_id: parseInt(route_params.get('id'), 10)});
          } else {
            this.subscribe('list_document');
          }
        });
        break;
      case 'list_category':
        this.$subscriptions[key] = this.category$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.categories = res;
          }
        });
        break;
      case 'list_document':
        this.document = null;
        this.loading = true;

        const list_params = [];

        if (this.resident_id !== null) {
          list_params.push({key: 'resident_id', value: this.resident_id});
        }

        if (params) {
          if (params.hasOwnProperty('category_id')) {
            list_params.push({key: 'category_id', value: params.category_id});
          }
        }

        this.$subscriptions[key] = this._service$.all(list_params).subscribe(res => {
            if (res) {
              this.loading = false;
              this.documents = res;

              if (res.length > 0) {
                if (params && params.hasOwnProperty('document_id')) {
                  this.openPDF(this.documents.filter(v => v.id === params.document_id).pop());
                } else {
                  this.openPDF(this.documents[0]);
                }
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

  public openPDF(document: Document | FacilityDocument | ResidentDocument) {
    this.document = document;
    setTimeout(() => PDFObject.embed(this.document.file, '#documentsPDFViewer'), 250);
  }

  addIfHasPermission(permission: string, level: number) {
    return this.auth_$.checkPermission([permission], level);
  }

  show_modal_add(): void {
    this.create_modal(this.component, data => this._service$.add(data), null);
  }

  show_modal_edit(): void {
    this.loading_edit_modal = true;
    this._service$.get(this.document.id).subscribe(
      res => {
        this.loading_edit_modal = false;

        this.create_modal(this.component, data => this._service$.edit(data), res);
      },
      error => {
        this.loading_edit_modal = false;
        // console.error(error);
      });
  }

  show_modal_remove(): void {
    let loading = false;
    this._service$.relatedInfo([this.document.id]).subscribe(value => {
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
                this._service$.removeBulk([this.document.id]).subscribe(
                  res => {
                    loading = false;

                    this.reload_data(null);

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

              this.reload_data(res);

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

              this.reload_data(res);

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
      if (component instanceof DocumentFormComponent
        || component instanceof FacilityDocumentFormComponent
        || component instanceof ResidentDocumentFormComponent
      ) {
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

  category_changes($event): void {
    this.subscribe('list_document', {category_id: this.category});
  }

  private reload_data(res: any): void {
    const params: any = {};

    if (this.category) {
      params.category_id = this.category;
    }

    if (res != null && Array.isArray(res) && res.length === 1) {
      params.document_id = res[0];
    } else {
      params.document_id = this.document.id;
    }

    this.subscribe('list_document', params);
  }

  public checkPermission(expected_permissions: string[]): boolean {
    return this.auth_$.checkPermission(expected_permissions);
  }
}
