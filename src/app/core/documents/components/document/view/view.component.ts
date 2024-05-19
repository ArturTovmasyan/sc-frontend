import {Component} from '@angular/core';
import {FormComponent} from '../form/form.component';
import {DocumentService} from '../../../services/document.service';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  _FormComponent = FormComponent;

  constructor(
    public service$: DocumentService,
  ) {
  }

}
