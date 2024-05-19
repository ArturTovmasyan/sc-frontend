/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Pipe, PipeTransform } from '@angular/core';
import { ScOptionGroupComponent } from './sc-option-group.component';
import { ScOptionComponent } from './sc-option.component';

export type TFilterOption = (input: string, option: ScOptionComponent) => boolean;

@Pipe({ name: 'scFilterOption' })
export class ScFilterOptionPipe implements PipeTransform {
  transform(
    options: ScOptionComponent[],
    searchValue: string,
    filterOption: TFilterOption,
    serverSearch: boolean
  ): ScOptionComponent[] {
    if (serverSearch || !searchValue) {
      return options;
    } else {
      return (options as ScOptionComponent[]).filter(o => filterOption(searchValue, o));
    }
  }
}

@Pipe({ name: 'scFilterGroupOption' })
export class ScFilterGroupOptionPipe implements PipeTransform {
  transform(
    groups: ScOptionGroupComponent[],
    searchValue: string,
    filterOption: TFilterOption,
    serverSearch: boolean
  ): ScOptionGroupComponent[] {
    if (serverSearch || !searchValue) {
      return groups;
    } else {
      return (groups as ScOptionGroupComponent[]).filter(g => {
        return g.listOfScOptionComponent.some(o => filterOption(searchValue, o));
      });
    }
  }
}

export function defaultFilterOption(searchValue: string, option: ScOptionComponent): boolean {
  if (option && option.scLabel) {
    return option.scLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
}
