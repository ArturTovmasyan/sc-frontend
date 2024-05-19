import {ModalFormComponent} from '../components/modal/modal-form.component';
import {ApplicationRef, ComponentFactory, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {CoreComponent} from '../../core/core.component';

@Injectable()
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
    const component = this.viewRef.createComponent(this.factory);
    component.changeDetectorRef.detectChanges();

    const instance = component.instance;
    instance.without_save_and_add = this._without_save_and_add;
    instance.component = form_component;
    return instance;
  }

}
