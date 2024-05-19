/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {ScOptionComponent} from './sc-option.component';

@Component({
  selector: 'sc-option-group',
  exportAs: 'scOptionGroup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sc-option-group.component.html'
})
export class ScOptionGroupComponent {
  isLabelString = false;
  label: string | TemplateRef<void>;
  @ContentChildren(ScOptionComponent) listOfScOptionComponent: QueryList<ScOptionComponent>;

  @Input()
  set scLabel(value: string | TemplateRef<void>) {
    this.label = value;
    this.isLabelString = !(this.scLabel instanceof TemplateRef);
  }

  get scLabel(): string | TemplateRef<void> {
    return this.label;
  }
}
