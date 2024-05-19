/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';

import {InputBoolean} from 'ng-zorro-antd/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'sc-option',
  exportAs: 'scOption',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sc-option.component.html'
})
export class ScOptionComponent implements OnChanges {
  changes = new Subject();
  @ViewChild(TemplateRef, {static: false}) template: TemplateRef<void>;
  @Input() scLabel: string;
  // tslint:disable-next-line:no-any
  @Input() scValue: any;
  @Input() @InputBoolean() scDisabled = false;
  @Input() @InputBoolean() scHide = false;
  @Input() @InputBoolean() scCustomContent = false;

  ngOnChanges(): void {
    this.changes.next();
  }
}
