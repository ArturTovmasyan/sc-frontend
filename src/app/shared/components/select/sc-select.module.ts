/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NzAddOnModule, NzNoAnimationModule, NzOverlayModule, NzStringTemplateOutletDirective} from 'ng-zorro-antd/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { ScOptionContainerComponent } from './sc-option-container.component';
import { ScOptionGroupComponent } from './sc-option-group.component';
import { ScOptionLiComponent } from './sc-option-li.component';
import { ScOptionComponent } from './sc-option.component';
import { ScFilterGroupOptionPipe, ScFilterOptionPipe } from './sc-option.pipe';
import { ScSelectTopControlComponent } from './sc-select-top-control.component';
import { ScSelectUnselectableDirective } from './sc-select-unselectable.directive';
import { ScSelectComponent } from './sc-select.component';

@NgModule({
  imports: [
    CommonModule,
    NzI18nModule,
    FormsModule,
    PlatformModule,
    OverlayModule,
    NzIconModule,
    NzAddOnModule,
    NzEmptyModule,
    NzOverlayModule,
    NzNoAnimationModule
  ],
  declarations: [
    ScFilterGroupOptionPipe,
    ScFilterOptionPipe,
    ScOptionComponent,
    ScSelectComponent,
    ScOptionContainerComponent,
    ScOptionGroupComponent,
    ScOptionLiComponent,
    ScSelectTopControlComponent,
    ScSelectUnselectableDirective
  ],
  exports: [
    ScOptionComponent,
    ScSelectComponent,
    ScOptionContainerComponent,
    ScOptionGroupComponent,
    ScSelectTopControlComponent
  ]
})
export class ScSelectModule {}
