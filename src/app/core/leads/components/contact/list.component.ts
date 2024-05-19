import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ContactService} from '../../services/contact.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Contact} from '../../models/contact';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ContactService, ModalFormService]
})
export class ListComponent extends GridComponent<Contact, ContactService> implements OnInit {
  constructor(
    protected service$: ContactService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-contact';
    this.name = 'lead-contact-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
