/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {filter, map, pairwise, takeUntil} from 'rxjs/operators';
import {ScOptionGroupComponent} from './sc-option-group.component';
import {ScOptionLiComponent} from './sc-option-li.component';
import {ScOptionComponent} from './sc-option.component';
import {ScSelectService} from './sc-select.service';

@Component({
  selector: '[sc-option-container]',
  exportAs: 'scOptionContainer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  templateUrl: './sc-option-container.component.html'
})
export class ScOptionContainerComponent implements OnDestroy, OnInit, AfterViewInit {
  private destroy$ = new Subject();
  private lastScrollTop = 0;
  @ViewChildren(ScOptionLiComponent) listOfScOptionLiComponent: QueryList<ScOptionLiComponent>;
  @ViewChild('dropdownUl', {static: true}) dropdownUl: ElementRef<HTMLUListElement>;
  @Input() scNotFoundContent: string;
  @Input() scMenuItemSelectedIcon: TemplateRef<void>;
  @Output() readonly scScrollToBottom = new EventEmitter<void>();

  scrollIntoViewIfNeeded(option: ScOptionComponent): void {
    // delay after open
    setTimeout(() => {
      if (this.listOfScOptionLiComponent && this.listOfScOptionLiComponent.length && option) {
        const targetOption = this.listOfScOptionLiComponent.find(o =>
          this.scSelectService.compareWith(o.scOption.scValue, option.scValue)
        );
        // tslint:disable:no-any
        if (targetOption && targetOption.el && (targetOption.el as any).scrollIntoViewIfNeeded) {
          (targetOption.el as any).scrollIntoViewIfNeeded(false);
        }
      }
    });
  }

  trackLabel(_index: number, option: ScOptionGroupComponent): string | TemplateRef<void> {
    return option.scLabel;
  }

  // tslint:disable-next-line:no-any
  trackValue(_index: number, option: ScOptionComponent): any {
    return option.scValue;
  }

  constructor(public scSelectService: ScSelectService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.scSelectService.activatedOption$.pipe(takeUntil(this.destroy$)).subscribe(option => {
      this.scrollIntoViewIfNeeded(option!);
    });
    this.scSelectService.check$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
    this.ngZone.runOutsideAngular(() => {
      const ul = this.dropdownUl.nativeElement;
      fromEvent<MouseEvent>(ul, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => {
          e.preventDefault();
          e.stopPropagation();
          if (ul && ul.scrollTop > this.lastScrollTop && ul.scrollHeight < ul.clientHeight + ul.scrollTop + 10) {
            this.lastScrollTop = ul.scrollTop;
            this.ngZone.run(() => {
              this.scScrollToBottom.emit();
            });
          }
        });
    });
  }

  ngAfterViewInit(): void {
    this.listOfScOptionLiComponent.changes
      .pipe(
        map(list => list.length),
        pairwise(),
        filter(([before, after]) => after < before),
        takeUntil(this.destroy$)
      )
      .subscribe(() => (this.lastScrollTop = 0));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
