import * as PDFObject from 'pdfobject';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TitleService} from '../../services/title.service';
import {NzFormatEmitEvent, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {HelpObject, HelpObjectType} from '../../models/help-object';
import {HelpCategory} from '../../models/help-category';
import {HelpService} from '../../services/help.service';

@Component({
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit, OnDestroy {
  HelpObjectType = HelpObjectType;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  categories: HelpCategory[];
  object: HelpObject;

  loading: boolean;

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private title$: TitleService,
    private service$: HelpService,
    private sanitizer: DomSanitizer
  ) {
    this.$subscriptions = {};

    this.object = null;
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('list_help');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'title':
        this.$subscriptions[key] = this.title$.getTitle().subscribe(v => this.title = v);
        break;
      case 'list_help':
        this.object = null;
        this.loading = true;
        this.$subscriptions[key] = this.service$.all().subscribe(res => {
          if (res) {
            this.loading = false;
            this.categories = res;
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

  openItem(data: NzFormatEmitEvent) {
    this.object = <any> data.node!.origin;
    if (this.object.type === HelpObjectType.PDF) {
      setTimeout(() => PDFObject.embed(this.object.url, '#helpPDFViewer'), 250);
    }
  }
}
