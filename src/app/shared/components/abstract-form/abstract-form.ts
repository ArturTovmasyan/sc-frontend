import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormError} from '../../models/form-error';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

export class AbstractForm {
  protected form: FormGroup;
  protected loading: boolean = false;
  private _submitted: boolean = false;
  protected error: string = null;
  protected message: string = null;

  private _loaded: BehaviorSubject<boolean>;

  protected submit: (data: any) => Observable<any>;
  public postSubmit: (data: any) => void = (data: any) => {
  };

  constructor() {
    this._loaded = new BehaviorSubject<boolean>(true);
  }

  public get f() {
    return this.form.controls;
  }

  public get formObject(): FormGroup {
    return this.form;
  }

  public submitForm() {
    this._submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.submit(this.form.value).subscribe(
      data => {
        this.loading = false;
        this.postSubmit(data);
      },
      error => {
        this.loading = false;
        this.message = null;

        this.handleSubmitError(error);
      });
  }

  public getErrors(control: AbstractControl): FormError[] {
    return Object.keys(control.errors)
      .filter((error) => control.errors[error])
      .map((error) => {
        let params = control.errors[error];
        return {
          error: error,
          params: params === true || params == {} ? null : params
        };
      });
  }

  public formErrors(): FormError[] {
    if (this._submitted && this.form.errors) {
      return this.getErrors(this.form);
    }
  }

  protected hasErrors(name: string) {
    const control = this.findFieldControl(name);

    return control != null && !(control instanceof FormGroup) && (control.dirty || control.touched) && control.errors != null;
  }

  public fieldErrors(name: string): FormError[] {
    let control = this.findFieldControl(name);
    if (control != null && !(control instanceof FormGroup) && (control.dirty || control.touched) && control.errors != null) {
      return this.getErrors(control);
    } else {
      return undefined;
    }
  }

  public resetFieldErrors(name: string): void {
    this.form.get(name).setErrors(null);
  }

  public handleSubmitError(error: any) {
    const message = error.data.error;
    const data = error.data.details;

    const fields = Object.keys(data || {});

    fields.forEach((field) => {
      const control = this.findFieldControl(field);
      control.setErrors({backend: data[field]});
    });

    if (message && error.data.code !== 610) { // TODO(haykg): review 610 errors
      this.form.setErrors({'backend': message});
    }
  }

  private findFieldControl(field: string): AbstractControl {
    let control: AbstractControl;
    if (field === 'base') {
      control = this.form;
    } else if (this.form.contains(field)) {
      control = this.form.get(field);
    } else if (field.match(/_id$/) && this.form.contains(field.substring(0, field.length - 3))) {
      control = this.form.get(field.substring(0, field.length - 3));
    } else if (field.indexOf('.') > 0) {
      let group: (FormGroup | FormArray) = this.form;
      field.split('.').forEach((f) => {
        if ((!(group instanceof FormArray) && group.contains(f)) || (group instanceof FormArray && group.get(f) != null)) {
          control = group.get(f);
          if (control instanceof FormGroup || control instanceof FormArray) {
            group = control;
          }
        } else {
          control = group;
        }
      });

      if (control instanceof FormGroup) {
        control = this.form;
      }
    } else {
      // Field is not defined in form but there is a validation error for it, set it globally
      control = this.form;
    }
    return control;
  }


  get submitted(): boolean {
    return this._submitted;
  }

  set submitted(value: boolean) {
    this._submitted = value;

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });
  }

  get loaded(): BehaviorSubject<boolean> {
    return this._loaded;
  }

  public add_field(key: string, value?: any): void {
    const form_array = this.get_form_array(key);
    if (form_array) {
      const item = this.get_form_array_skeleton(key);
      if (item instanceof FormGroup && value) {
        item.patchValue(value);
      } else if (item instanceof FormControl && value) {
        item.patchValue(value);
      }

      form_array.push(item);
    }
  }

  public remove_field(key: string, i: number): void {
    const form_array = this.get_form_array(key);
    if (form_array) {
      form_array.removeAt(i);
    }
  }

  public get_form_array(key: string): FormArray {
    const control = this.form.get(key);

    if (control instanceof FormArray) {
      return control as FormArray;
    }

    return null;
  }

  public get_form_array_skeleton(key: string): FormGroup | FormControl {
    return null;
  }

  public before_submit(): void {
  }

  public after_set_form_data(): void {
  }
}
