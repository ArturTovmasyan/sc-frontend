import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentDocumentService} from '../../../services/resident-document.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentDocument} from '../../../models/resident-document';
import {ResidentSelectorService} from '../../../services/resident-selector.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentDocumentService]
})
export class ListComponent extends GridComponent<ResidentDocument, ResidentDocumentService> implements OnInit {
  constructor(
    protected service$: ResidentDocumentService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    private residentSelector$: ResidentSelectorService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-document-list';
  }

  ngOnInit(): void {
    this.buttons_center.push(
      {
        name: 'download',
        type: 'default',
        multiselect: false,
        free: false,
        nzIcon: null,
        faIcon: 'far fa-file',
        click: (ids: number[]) => {
          this.loading = true;
          this.service$.download(ids[0], () => {
            this.loading = false;
          }, (error) => {
            this.message$.error(error.data.error, {nzDuration: 10000});
          });
        }
      }
    );

    this.subscribe('rs_resident');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            if (this.params.filter(v => v.key === 'resident_id').length === 0) {
              this.params.push({key: 'resident_id', value: next.toString()});
              super.init();
            }
          }
        });
        break;
      default:
        break;
    }
  }
}
