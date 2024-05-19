import {AfterViewInit, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputCounterComponent),
  multi: true
};

const noop = () => {
};

@Component({
  selector: 'input-counter',
  templateUrl: './input-counter.component.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class InputCounterComponent implements AfterViewInit, ControlValueAccessor {
  innerValue: any = '';
  onTouchedCallback: () => void = noop;
  onChangeCallback: (_: any) => void = noop;
  counter: number;
  enabled: boolean;

  @Input()
  id: string;
  @Input()
  type = 'text';
  @Input()
  name: string;
  @Input()
  maxlength: number;
  @Input()
  minlength: number;
  @Input()
  className: string;
  @Input()
  placeholder = '';
  @Input()
  disabled = false;
  @Input()
  readonly = false;
  @Input()
  pattern: string;
  @Input()
  required = false;
  @Output()
  focus: EventEmitter<any> = new EventEmitter();
  @Output()
  blur: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit(): void {
    this.updateCounter();
  }

  enableCounter() {
    this.enabled = true;
  }

  disableCounter() {
    this.enabled = false;
  }

  displayMinLength() {
    return this.minlength && this.counter < this.minlength;
  }

  displayMaxLength() {
    return this.maxlength && this.counter > 0 && !this.displayMinLength();
  }

  onFocus() {
    this.enableCounter();
    this.focus.emit();
  }

  onBlur() {
    this.disableCounter();
    this.onTouchedCallback();
    this.blur.emit();
  }

  updateCounter() {
    if (this.innerValue) {
      this.counter = this.innerValue.length;
    } else {
      this.counter = 0;
    }
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.updateCounter();
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  get value() {
    return this.innerValue;
  }

  set value(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.updateCounter();
      this.onChangeCallback(value);
    }
  }
}
