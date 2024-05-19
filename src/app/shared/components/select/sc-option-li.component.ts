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
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {isNotNil} from 'ng-zorro-antd/core';

import {ScOptionComponent} from './sc-option.component';
import {ScSelectService} from './sc-select.service';

@Component({
  selector: '[sc-option-li]',
  exportAs: 'scOptionLi',
  templateUrl: './sc-option-li.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ant-select-dropdown-menu-item-selected]': 'selected && !scOption.scDisabled',
    '[class.ant-select-dropdown-menu-item-disabled]': 'scOption.scDisabled',
    '[class.ant-select-dropdown-menu-item-active]': 'active && !scOption.scDisabled',
    '[attr.unselectable]': '"unselectable"',
    '[style.user-select]': '"none"',
    '(click)': 'clickOption()',
    '(mousedown)': '$event.preventDefault()'
  }
})
export class ScOptionLiComponent implements OnInit, OnDestroy {
  el: HTMLElement = this.elementRef.nativeElement;
  selected = false;
  active = false;
  destroy$ = new Subject();
  @Input() scOption: ScOptionComponent;
  @Input() scMenuItemSelectedIcon: TemplateRef<void>;

  clickOption(): void {
    this.scSelectService.clickOption(this.scOption);
  }

  constructor(
    private elementRef: ElementRef,
    public scSelectService: ScSelectService,
    private cdr: ChangeDetectorRef,
    renderer: Renderer2
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-select-dropdown-menu-item');
  }

  ngOnInit(): void {
    this.scSelectService.listOfSelectedValue$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.selected = isNotNil(list.find(v => this.scSelectService.compareWith(v, this.scOption.scValue)));
      this.cdr.markForCheck();
    });
    this.scSelectService.activatedOption$.pipe(takeUntil(this.destroy$)).subscribe(option => {
      if (option) {
        this.active = this.scSelectService.compareWith(option.scValue, this.scOption.scValue);
      } else {
        this.active = false;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
