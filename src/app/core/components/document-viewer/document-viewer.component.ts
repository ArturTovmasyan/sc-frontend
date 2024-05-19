import * as PDFObject from 'pdfobject';
import {DomSanitizer} from '@angular/platform-browser';
import {Component, Input, OnDestroy, OnInit, Type} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
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

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html'
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  private static pdf_formats: string[] = ['pdf'];
  private static office_formats: string[] = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
  private static support_formats: string[] = [...DocumentViewerComponent.pdf_formats, ...DocumentViewerComponent.office_formats];

  private _service$: GridService<any>;
  private _permission: string;

  @Input('component') component: Type<any>;

  @Input('show-category') show_category: boolean;

  @Input('service') set service(value: GridService<any>) {
    this._service$ = value;
  }

  get service(): GridService<any> {
    return this._service$;
  }

  @Input('permission') set permission(value: string) {
    this._permission = value;
  }

  get permission(): string {
    return this._permission;
  }

  @Input('resident-id') resident_id: number;

  @Input('title') title: string;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  categories: DocumentCategory[];
  category: DocumentCategory;

  documents: Document[] | FacilityDocument[] | ResidentDocument[];
  document: Document | FacilityDocument | ResidentDocument;

  officeUrl: any = null;

  loading: boolean;
  loading_edit_modal: boolean;

  protected $subscriptions: { [key: string]: Subscription; };

  public modal_callback: (data: any) => void = (data: any) => this.reload_data(data);

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
          if (params.hasOwnProperty('category_id') && params.category_id !== null) {
            list_params.push({key: 'category_id', value: params.category_id});
          }
        }

        this.$subscriptions[key] = this._service$.all(list_params).subscribe(res => {
          if (res) {
            this.loading = false;
            this.documents = res;

            if (res.length > 0) {
              if (params && params.hasOwnProperty('document_id')) {
                this.open(this.documents.filter(v => v.id === params.document_id).pop());
              } else {
                this.open(this.documents[0]);
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

  addIfHasPermission(permission: string, level: number) {
    return this.auth_$.checkPermission([permission], level);
  }

  public checkPermission(expected_permissions: string[]): boolean {
    return this.auth_$.checkPermission(expected_permissions);
  }

  public open(document: Document | FacilityDocument | ResidentDocument) {
    if (this.isPDF(document)) {
      this.openPDF(document);
    } else if (this.isOffice(document)) {
      this.openOffice(document);
    } else {
      this.document = document;
    }
  }

  public openPDF(document: Document | FacilityDocument | ResidentDocument) {
    this.officeUrl = null;
    this.document = document;

    if (this.document) {
      setTimeout(() => PDFObject.embed(this.document.file, '#documentsPDFViewer'), 250);
    }
  }

  public openOffice(document: Document | FacilityDocument | ResidentDocument) {
    this.officeUrl = null;
    this.document = document;

    if (this.document) {
      const escaped_url = encodeURIComponent(this.document.file);
      this.officeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${escaped_url}`);

      console.log(this.officeUrl);
    }
  }

  public checkExtension(document: Document | FacilityDocument | ResidentDocument) {
    if (document.hasOwnProperty('extension')) {
      return DocumentViewerComponent.support_formats.includes(document.extension);
    }

    return true;
  }

  isPDF(document: Document | FacilityDocument | ResidentDocument) {
    if (document.hasOwnProperty('extension')) {
      return DocumentViewerComponent.pdf_formats.includes(document.extension);
    }

    return true;
  }

  isOffice(document: Document | FacilityDocument | ResidentDocument) {
    if (document.hasOwnProperty('extension')) {
      return DocumentViewerComponent.office_formats.includes(document.extension);
    }

    return false;
  }

}
