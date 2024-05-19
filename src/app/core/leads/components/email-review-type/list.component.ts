import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {EmailReviewTypeService} from '../../services/email-review-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {EmailReviewType} from '../../models/email-review-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [EmailReviewTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<EmailReviewType, EmailReviewTypeService> implements OnInit {
  constructor(
    protected service$: EmailReviewTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-email_review_type';
    this.name = 'lead-email-review-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
