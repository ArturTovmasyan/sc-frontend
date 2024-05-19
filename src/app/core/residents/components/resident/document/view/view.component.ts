import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormComponent} from '../form/form.component';
import {ResidentDocumentService} from '../../../../services/resident-document.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ResidentService} from '../../../../services/resident.service';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ResidentPipe} from '../../../../pipes/resident.pipe';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  _FormComponent = FormComponent;

  title: string;

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    public service$: ResidentDocumentService,
    public resident$: ResidentService,
    public residentSelector$: ResidentSelectorService
  ) {
    this.$subscriptions = {};

    this.title = '';
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string, params?: any) {
    switch (key) {
      case 'get_resident':
        this.$subscriptions[key] = this.resident$.get(this.residentSelector$.resident.value).pipe(first()).subscribe(res => {
          if (res) {
            this.title = (new ResidentPipe()).transform(res);
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.subscribe('get_resident');
          }
        });
        break;
      default:
        break;
    }
  }
}
