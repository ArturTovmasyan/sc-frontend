/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {FocusMonitor} from '@angular/cdk/a11y';
import {CdkConnectedOverlay, CdkOverlayOrigin, ConnectedOverlayPositionChange} from '@angular/cdk/overlay';
import {Platform} from '@angular/cdk/platform';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EMPTY, merge, Subject} from 'rxjs';
import {flatMap, startWith, takeUntil} from 'rxjs/operators';

import {InputBoolean, isNotNil, NzNoAnimationDirective, NzSizeLDSType, slideMotion, toBoolean} from 'ng-zorro-antd/core';

import {ScOptionGroupComponent} from './sc-option-group.component';
import {ScOptionComponent} from './sc-option.component';
import {TFilterOption} from './sc-option.pipe';
import {ScSelectTopControlComponent} from './sc-select-top-control.component';
import {ScSelectService} from './sc-select.service';

@Component({
  selector: 'sc-select',
  exportAs: 'scSelect',
  preserveWhitespaces: false,
  providers: [
    ScSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideMotion],
  templateUrl: './sc-select.component.html',
  host: {
    '[class.ant-select-lg]': 'scSize==="large"',
    '[class.ant-select-sm]': 'scSize==="small"',
    '[class.ant-select-enabled]': '!scDisabled',
    '[class.ant-select-no-arrow]': '!scShowArrow',
    '[class.ant-select-disabled]': 'scDisabled',
    '[class.ant-select-allow-clear]': 'scAllowClear',
    '[class.ant-select-open]': 'open',
    '(click)': 'toggleDropDown()'
  },
  styles: [
    `
      .ant-select-dropdown {
        top: 100%;
        left: 0;
        position: relative;
        width: 100%;
        margin-top: 4px;
        margin-bottom: 4px;
      }
    `
  ]
})
export class ScSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, AfterContentInit {
  open = false;
  // tslint:disable-next-line:no-any
  value: any | any[];
  onChange: (value: string | string[]) => void = () => null;
  onTouched: () => void = () => null;
  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  triggerWidth: number;
  private _disabled = false;
  private _autoFocus = false;
  private isInit = false;
  private destroy$ = new Subject();
  @ViewChild(CdkOverlayOrigin) cdkOverlayOrigin: CdkOverlayOrigin;
  @ViewChild(CdkConnectedOverlay) cdkConnectedOverlay: CdkConnectedOverlay;
  @ViewChild(ScSelectTopControlComponent) scSelectTopControlComponent: ScSelectTopControlComponent;
  /** should move to sc-option-container when https://github.com/angular/angular/issues/20810 resolved **/
  @ContentChildren(ScOptionComponent) listOfScOptionComponent: QueryList<ScOptionComponent>;
  @ContentChildren(ScOptionGroupComponent) listOfScOptionGroupComponent: QueryList<ScOptionGroupComponent>;
  @Output() readonly scOnSearch = new EventEmitter<string>();
  @Output() readonly scScrollToBottom = new EventEmitter<void>();
  @Output() readonly scOpenChange = new EventEmitter<boolean>();
  @Output() readonly scBlur = new EventEmitter<void>();
  @Output() readonly scFocus = new EventEmitter<void>();
  @Input() scSize: NzSizeLDSType = 'default';
  @Input() scDropdownClassName: string;
  @Input() scDropdownMatchSelectWidth = true;
  @Input() scDropdownStyle: { [key: string]: string };
  @Input() scNotFoundContent: string;
  @Input() @InputBoolean() scAllowClear = false;
  @Input() @InputBoolean() scShowSearch = false;
  @Input() @InputBoolean() scLoading = false;
  @Input() scPlaceHolder: string;
  @Input() scMaxTagCount: number;
  @Input() scDropdownRender: TemplateRef<void>;
  @Input() scCustomTemplate: TemplateRef<{ $implicit: ScOptionComponent }>;
  @Input() scSuffixIcon: TemplateRef<void>;
  @Input() scClearIcon: TemplateRef<void>;
  @Input() scRemoveIcon: TemplateRef<void>;
  @Input() scMenuItemSelectedIcon: TemplateRef<void>;
  @Input() scShowArrow = true;
  @Input()
  set scTokenSeparators(value: string[]) {
    this.scSelectService.tokenSeparators = value;
  }

  get scTokenSeparators(): string[] {
    return this.scSelectService.tokenSeparators;
  }

  // tslint:disable-next-line:no-any
  @Input() scMaxTagPlaceholder: TemplateRef<{ $implicit: any[] }>;

  @Input()
  set scAutoClearSearchValue(value: boolean) {
    this.scSelectService.autoClearSearchValue = toBoolean(value);
  }

  @Input()
  set scMaxMultipleCount(value: number) {
    this.scSelectService.maxMultipleCount = value;
  }

  @Input()
  set scServerSearch(value: boolean) {
    this.scSelectService.serverSearch = toBoolean(value);
  }

  @Input()
  set scMode(value: 'default' | 'multiple' | 'tags') {
    this.scSelectService.mode = value;
    this.scSelectService.check();
  }

  @Input()
  set scFilterOption(value: TFilterOption) {
    this.scSelectService.filterOption = value;
  }

  @Input()
  // tslint:disable-next-line:no-any
  set compareWith(value: (o1: any, o2: any) => boolean) {
    this.scSelectService.compareWith = value;
  }

  @Input()
  set scAutoFocus(value: boolean) {
    this._autoFocus = toBoolean(value);
    this.updateAutoFocus();
  }

  get scAutoFocus(): boolean {
    return this._autoFocus;
  }

  @Input()
  set scOpen(value: boolean) {
    this.open = value;
    this.scSelectService.setOpenState(value);
  }

  @Input()
  set scDisabled(value: boolean) {
    this._disabled = toBoolean(value);
    this.scSelectService.disabled = this._disabled;
    this.scSelectService.check();
    if (this.scDisabled && this.isInit) {
      this.closeDropDown();
    }
  }

  get scDisabled(): boolean {
    return this._disabled;
  }

  updateAutoFocus(): void {
    if (this.scSelectTopControlComponent.inputElement) {
      if (this.scAutoFocus) {
        this.renderer.setAttribute(
          this.scSelectTopControlComponent.inputElement.nativeElement,
          'autofocus',
          'autofocus'
        );
      } else {
        this.renderer.removeAttribute(this.scSelectTopControlComponent.inputElement.nativeElement, 'autofocus');
      }
    }
  }

  focus(): void {
    if (this.scSelectTopControlComponent.inputElement) {
      this.focusMonitor.focusVia(this.scSelectTopControlComponent.inputElement, 'keyboard');
      this.scFocus.emit();
    }
  }

  blur(): void {
    if (this.scSelectTopControlComponent.inputElement) {
      this.scSelectTopControlComponent.inputElement.nativeElement.blur();
      this.scBlur.emit();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    this.scSelectService.onKeyDown(event);
  }

  toggleDropDown(): void {
    if (!this.scDisabled) {
      this.scSelectService.setOpenState(!this.open);
    }
  }

  closeDropDown(): void {
    this.scSelectService.setOpenState(false);
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.dropDownPosition = position.connectionPair.originY;
  }

  updateCdkConnectedOverlayStatus(): void {
    if (this.platform.isBrowser) {
      this.triggerWidth = this.cdkOverlayOrigin.elementRef.nativeElement.getBoundingClientRect().width;
    }
  }

  updateCdkConnectedOverlayPositions(): void {
    setTimeout(() => {
      if (this.cdkConnectedOverlay && this.cdkConnectedOverlay.overlayRef) {
        this.cdkConnectedOverlay.overlayRef.updatePosition();
      }
    });
  }

  constructor(
    private renderer: Renderer2,
    public scSelectService: ScSelectService,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
    private platform: Platform,
    elementRef: ElementRef,
    @Host() @Optional() public noAnimation?: NzNoAnimationDirective
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-select');
  }

  /** update ngModel -> update listOfSelectedValue **/
  // tslint:disable-next-line:no-any
  writeValue(value: any | any[]): void {
    this.value = value;
    let listValue: any[] = []; // tslint:disable-line:no-any
    if (isNotNil(value)) {
      if (this.scSelectService.isMultipleOrTags) {
        listValue = value;
      } else {
        listValue = [value];
      }
    }
    this.scSelectService.updateListOfSelectedValue(listValue, false);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.scDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.scSelectService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.scOnSearch.emit(data);
      this.updateCdkConnectedOverlayPositions();
    });
    this.scSelectService.modelChange$.pipe(takeUntil(this.destroy$)).subscribe(modelValue => {
      if (this.value !== modelValue) {
        this.value = modelValue;
        this.onChange(this.value);
        this.updateCdkConnectedOverlayPositions();
      }
    });
    this.scSelectService.open$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.open !== value) {
        this.scOpenChange.emit(value);
      }
      if (value) {
        this.focus();
        this.updateCdkConnectedOverlayStatus();
      } else {
        this.blur();
        this.onTouched();
      }
      this.open = value;

      this.scSelectService.clearInput();
    });
    this.scSelectService.check$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.updateCdkConnectedOverlayStatus();
    this.isInit = true;
  }

  ngAfterContentInit(): void {
    this.listOfScOptionGroupComponent.changes
      .pipe(
        startWith(true),
        flatMap(() =>
          merge(
            this.listOfScOptionGroupComponent.changes,
            this.listOfScOptionComponent.changes,
            ...this.listOfScOptionComponent.map(option => option.changes),
            ...this.listOfScOptionGroupComponent.map(group =>
              group.listOfScOptionComponent ? group.listOfScOptionComponent.changes : EMPTY
            )
          ).pipe(startWith(true))
        )
      )
      .subscribe(() => {
        this.scSelectService.updateTemplateOption(
          this.listOfScOptionComponent.toArray(),
          this.listOfScOptionGroupComponent.toArray()
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
