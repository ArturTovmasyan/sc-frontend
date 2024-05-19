import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentDocumentService} from '../../../services/resident-document.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentDocument} from '../../../models/resident-document';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Button, ButtonMode} from '../../../../../shared/components/modal/button-bar.component';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentDocumentService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentDocument, ResidentDocumentService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: ResidentDocumentService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-document-list';
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
  }

  ngAfterViewInit(): void {
    this.add_button_center(new Button(
      'download',
      'grid.resident-document-list.button.download',
      'default',
      ButtonMode.SINGLE_SELECT,
      null,
      'far fa-file',
      false,
      true,
      () => {
        this.loading = true;
        this.service$.download(this.checkbox_config.ids[0], () => {
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this.message$.error(error.data.error, {nzDuration: 10000});
        });
      }));
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
