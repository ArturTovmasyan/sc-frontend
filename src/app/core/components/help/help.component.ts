import * as PDFObject from 'pdfobject';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TitleService} from '../../services/title.service';
import {NzFormatEmitEvent, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {HelpObject, HelpObjectType} from '../../models/help-object';
import {HelpCategory} from '../../models/help-category';
import {HelpService} from '../../services/help.service';
import {EmbedVideoService} from 'ngx-embed-video/dist';

@Component({
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit, OnDestroy {
  HelpObjectType = HelpObjectType;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);
  iframe_html: any;

  categories: HelpCategory[];
  object: HelpObject;

  loading: boolean;

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private title$: TitleService,
    private service$: HelpService,
    private embedService: EmbedVideoService,
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
    this.object = <any>data.node!.origin;
    switch (this.object.type) {
      case HelpObjectType.PDF:
        setTimeout(() => PDFObject.embed(this.object.url, '#helpPDFViewer'), 250);
        break;
      case HelpObjectType.VIMEO:
        this.iframe_html = this.embedService.embed(this.object.vimeo_url, {
          attr: {
            style: 'width:100%;height:80vh'
          }
        });
        break;
      case HelpObjectType.YOUTUBE:
        this.iframe_html = this.embedService.embed(this.object.youtube_url, {
          attr: {
            style: 'width:100%;height:80vh'
          }
        });
        break;
    }
  }
}
