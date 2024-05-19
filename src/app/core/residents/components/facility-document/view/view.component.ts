import {Component} from '@angular/core';
import {FormComponent} from '../form/form.component';
import {FacilityDocumentService} from '../../../services/facility-document.service';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  _FormComponent = FormComponent;

  constructor(
    protected service$: FacilityDocumentService,
  ) {
  }

}
