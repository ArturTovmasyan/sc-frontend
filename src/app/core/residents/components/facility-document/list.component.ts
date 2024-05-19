import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {FormComponent} from './form/form.component';
import {ModalFormService} from '../../../../shared/services/modal-form.service';
import {FacilityDocumentService} from '../../services/facility-document.service';
import {FacilityDocument} from '../../models/facility-document';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../services/title.service';
import {Button, ButtonMode} from '../../../../shared/components/modal/button-bar.component';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityDocumentService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityDocument, FacilityDocumentService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: FacilityDocumentService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'facility-document-list';
  }

  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {
    this.add_button_center(new Button(
      'download',
      'grid.facility-document-list.button.download',
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
}
