import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../../facility-document/form/form.component';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FacilityDocumentService} from '../../../services/facility-document.service';
import {FacilityDocument} from '../../../models/facility-document';
import {Button, ButtonMode} from '../../../../../shared/components/modal/button-bar.component';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-facility-document',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityDocumentService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityDocument, FacilityDocumentService> implements OnInit, AfterViewInit {
  @Input() facility_id: number;

  constructor(
    protected service$: FacilityDocumentService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private message$: NzMessageService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'facility-document-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'facility_id', value: this.facility_id.toString()});

    super.init();
  }

  ngAfterViewInit() {
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

    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('facility_id').setValue(this.facility_id);
      form.get('facility_id').disable();
    };
  }

}
