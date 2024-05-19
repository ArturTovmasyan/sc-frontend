import {ModalFormComponent} from '../components/modal/modal-form.component';
import {ApplicationRef, ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {CoreComponent} from '../../core/core.component';

@Injectable({
  providedIn: 'root'
})
export class ModalFormService {
  private factory: ComponentFactory<ModalFormComponent>;
  private viewRef: ViewContainerRef;

  private _without_save_and_add: boolean;

  set without_save_and_add(value: boolean) {
    this._without_save_and_add = value;
  }

  constructor(
    private resolver$: ComponentFactoryResolver,
    private appRef: ApplicationRef,
  ) {
    this.factory = this.resolver$.resolveComponentFactory(ModalFormComponent);
    this.viewRef = (appRef.components[0].instance as CoreComponent).viewRef; // TODO: find more elegant way to achieve this.

    this._without_save_and_add = false;
  }

  public create(form_component: any): ModalFormComponent {
    return this.create_modal(form_component, this._without_save_and_add);
  }

  public create_sub(form_component: any): ModalFormComponent {
    return this.create_modal(form_component, true);
  }

  private create_modal(form_component: any, without_save_and_add: boolean): ModalFormComponent {
    const component = this.viewRef.createComponent(this.factory);
    component.changeDetectorRef.detectChanges();

    const instance = component.instance;
    instance.without_save_and_add = without_save_and_add;
    instance.component = form_component;
    return instance;
  }

}
