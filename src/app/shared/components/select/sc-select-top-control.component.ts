/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import { zoomMotion, NzNoAnimationDirective } from 'ng-zorro-antd/core';

import {ScOptionComponent} from './sc-option.component';
import {ScSelectService} from './sc-select.service';

@Component({
  selector: '[sc-select-top-control]',
  exportAs: 'scSelectTopControl',
  preserveWhitespaces: false,
  animations: [zoomMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sc-select-top-control.component.html'
})
export class ScSelectTopControlComponent implements OnInit, OnDestroy {
  inputValue: string;
  isComposing = false;
  private destroy$ = new Subject();
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  @ViewChild('mirrorElement', { static: false }) mirrorElement: ElementRef;
  @Input() scShowSearch = false;
  @Input() scPlaceHolder: string;
  @Input() scOpen = false;
  @Input() scMaxTagCount: number;
  @Input() scAllowClear = false;
  @Input() scShowArrow = true;
  @Input() scLoading = false;
  @Input() scCustomTemplate: TemplateRef<{ $implicit: ScOptionComponent }>;
  @Input() scSuffixIcon: TemplateRef<void>;
  @Input() scClearIcon: TemplateRef<void>;
  @Input() scRemoveIcon: TemplateRef<void>;
  // tslint:disable-next-line:no-any
  @Input() scMaxTagPlaceholder: TemplateRef<{ $implicit: any[] }>;
  @Input() scTokenSeparators: string[] = [];

  onClearSelection(e: MouseEvent): void {
    e.stopPropagation();
    this.scSelectService.updateListOfSelectedValue([], true);
  }

  setInputValue(value: string): void {
    /** fix clear value https://github.com/NG-ZORRO/ng-zorro-antd/issues/3825 **/
    if (this.inputDOM && !value) {
      this.inputDOM.value = value;
    }
    this.inputValue = value;
    this.updateWidth();
    this.scSelectService.updateSearchValue(value);
    this.scSelectService.tokenSeparate(this.inputValue, this.scTokenSeparators);
  }

  get mirrorDOM(): HTMLElement {
    return this.mirrorElement && this.mirrorElement.nativeElement;
  }

  get inputDOM(): HTMLInputElement {
    return this.inputElement && this.inputElement.nativeElement;
  }

  get placeHolderDisplay(): string {
    return this.inputValue || this.isComposing || this.scSelectService.listOfSelectedValue.length ? 'none' : 'block';
  }

  get selectedValueStyle(): { [key: string]: string } {
    let showSelectedValue = false;
    let opacity = 1;
    if (!this.scShowSearch) {
      showSelectedValue = true;
    } else {
      if (this.scOpen) {
        showSelectedValue = !(this.inputValue || this.isComposing);
        if (showSelectedValue) {
          opacity = 0.4;
        }
      } else {
        showSelectedValue = true;
      }
    }
    return {
      display: showSelectedValue ? 'block' : 'none',
      opacity: `${opacity}`
    };
  }

  // tslint:disable-next-line:no-any
  trackValue(_index: number, option: ScOptionComponent): any {
    return option.scValue;
  }

  updateWidth(): void {
    if (this.mirrorDOM && this.inputDOM && this.inputDOM.value) {
      this.mirrorDOM.innerText = `${this.inputDOM.value}&nbsp;`;
      this.renderer.removeStyle(this.inputDOM, 'width');
      this.renderer.setStyle(this.inputDOM, 'width', `${this.mirrorDOM.clientWidth}px`);
    } else if (this.inputDOM) {
      this.renderer.removeStyle(this.inputDOM, 'width');
      this.mirrorDOM.innerText = '';
    }
  }

  removeSelectedValue(option: ScOptionComponent, e: MouseEvent): void {
    this.scSelectService.removeValueFormSelected(option);
    e.stopPropagation();
  }

  animationEnd(): void {
    this.scSelectService.animationEvent$.next();
  }

  constructor(
    private renderer: Renderer2,
    public scSelectService: ScSelectService,
    private cdr: ChangeDetectorRef,
    @Host() @Optional() public noAnimation?: NzNoAnimationDirective
  ) {}

  ngOnInit(): void {
    this.scSelectService.open$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      if (this.inputElement && open) {
        setTimeout(() => this.inputDOM.focus());
      }
    });
    this.scSelectService.clearInput$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setInputValue('');
    });
    this.scSelectService.check$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
