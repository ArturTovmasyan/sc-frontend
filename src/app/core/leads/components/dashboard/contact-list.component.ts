import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {Contact} from '../../models/contact';
import {TitleService} from '../../../services/title.service';
import {FormComponent} from '../contact/form/form.component';
import {ContactService} from '../../services/contact.service';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-dashboard-contact',
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ContactService, ModalFormService]
})
export class ListComponent extends GridComponent<Contact, ContactService> implements OnInit, AfterViewInit {
  constructor(
    protected service$: ContactService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-lead-contact';
    this.name = 'lead-contact-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'my', value: '1'});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      // form.get('owner_type').setValue(ContactOwnerType.REFERRAL);
      // form.get('referral_id').setValue(this.referral_id);
    };
  }
}
