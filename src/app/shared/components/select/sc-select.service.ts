/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BACKSPACE, DOWN_ARROW, ENTER, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { combineLatest, merge, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, share, skip, tap } from 'rxjs/operators';

import { isNil, isNotNil } from 'ng-zorro-antd/core';

import { ScOptionGroupComponent } from './sc-option-group.component';
import { ScOptionComponent } from './sc-option.component';
import { defaultFilterOption, ScFilterOptionPipe, TFilterOption } from './sc-option.pipe';

@Injectable()
export class ScSelectService {
  // Input params
  autoClearSearchValue = true;
  serverSearch = false;
  filterOption: TFilterOption = defaultFilterOption;
  mode: 'default' | 'multiple' | 'tags' = 'default';
  maxMultipleCount = Infinity;
  disabled = false;
  private _tokenSeparators: string[] = [];
  // tslint:disable-next-line:no-any
  compareWith = (o1: any, o2: any) => o1 === o2;
  // selectedValueChanged should emit ngModelChange or not
  // tslint:disable-next-line:no-any
  private listOfSelectedValueWithEmit$ = new BehaviorSubject<{ value: any[]; emit: boolean }>({
    value: [],
    emit: false
  });
  // ContentChildren Change
  private mapOfTemplateOption$ = new BehaviorSubject<{
    listOfScOptionComponent: ScOptionComponent[];
    listOfScOptionGroupComponent: ScOptionGroupComponent[];
  }>({
    listOfScOptionComponent: [],
    listOfScOptionGroupComponent: []
  });
  // searchValue Change
  private searchValueRaw$ = new BehaviorSubject<string>('');
  private listOfFilteredOption: ScOptionComponent[] = [];
  private openRaw$ = new Subject<boolean>();
  private checkRaw$ = new Subject();
  private open = false;
  clearInput$ = new Subject<boolean>();
  searchValue = '';
  isShowNotFound = false;
  // open
  open$ = this.openRaw$.pipe(distinctUntilChanged());
  activatedOption: ScOptionComponent | null;
  activatedOption$ = new ReplaySubject<ScOptionComponent | null>(1);
  listOfSelectedValue$ = this.listOfSelectedValueWithEmit$.pipe(map(data => data.value));
  modelChange$ = this.listOfSelectedValueWithEmit$.pipe(
    filter(item => item.emit),
    map(data => {
      const selectedList = data.value;
      let modelValue: any[] | null = null; // tslint:disable-line:no-any
      if (this.isSingleMode) {
        if (selectedList.length) {
          modelValue = selectedList[0];
        }
      } else {
        modelValue = selectedList;
      }
      return modelValue;
    })
  );
  searchValue$ = this.searchValueRaw$.pipe(
    distinctUntilChanged(),
    skip(1),
    share(),
    tap(value => {
      this.searchValue = value;
      if (value) {
        this.updateActivatedOption(this.listOfFilteredOption[0]);
      }
      this.updateListOfFilteredOption();
    })
  );
  // tslint:disable-next-line:no-any
  listOfSelectedValue: any[] = [];
  // flat ViewChildren
  listOfTemplateOption: ScOptionComponent[] = [];
  // tag option
  listOfTagOption: ScOptionComponent[] = [];
  // tag option concat template option
  listOfTagAndTemplateOption: ScOptionComponent[] = [];
  // ViewChildren
  listOfScOptionComponent: ScOptionComponent[] = [];
  listOfScOptionGroupComponent: ScOptionGroupComponent[] = [];
  // click or enter add tag option
  addedTagOption: ScOptionComponent | null;
  // display in top control
  listOfCachedSelectedOption: ScOptionComponent[] = [];
  // selected value or ViewChildren change
  valueOrOption$ = combineLatest([this.listOfSelectedValue$, this.mapOfTemplateOption$]).pipe(
    tap(data => {
      const [listOfSelectedValue, mapOfTemplateOption] = data;
      this.listOfSelectedValue = listOfSelectedValue;
      this.listOfScOptionComponent = mapOfTemplateOption.listOfScOptionComponent;
      this.listOfScOptionGroupComponent = mapOfTemplateOption.listOfScOptionGroupComponent;
      this.listOfTemplateOption = this.listOfScOptionComponent.concat(
        this.listOfScOptionGroupComponent.reduce(
          (pre, cur) => [...pre, ...cur.listOfScOptionComponent.toArray()],
          [] as ScOptionComponent[]
        )
      );
      this.updateListOfTagOption();
      this.updateListOfFilteredOption();
      this.resetActivatedOptionIfNeeded();
      this.updateListOfCachedOption();
    }),
    share()
  );
  check$ = merge(
    this.checkRaw$,
    this.valueOrOption$,
    this.searchValue$,
    this.activatedOption$,
    this.open$,
    this.modelChange$
  ).pipe(share());

  clickOption(option: ScOptionComponent): void {
    /** update listOfSelectedOption -> update listOfSelectedValue -> next listOfSelectedValue$ **/
    if (!option.scDisabled) {
      this.updateActivatedOption(option);
      let listOfSelectedValue = [...this.listOfSelectedValue];
      if (this.isMultipleOrTags) {
        const targetValue = listOfSelectedValue.find(o => this.compareWith(o, option.scValue));
        if (isNotNil(targetValue)) {
          listOfSelectedValue.splice(listOfSelectedValue.indexOf(targetValue), 1);
          this.updateListOfSelectedValue(listOfSelectedValue, true);
        } else if (listOfSelectedValue.length < this.maxMultipleCount) {
          listOfSelectedValue.push(option.scValue);
          this.updateListOfSelectedValue(listOfSelectedValue, true);
        }
      } else if (!this.compareWith(listOfSelectedValue[0], option.scValue)) {
        listOfSelectedValue = [option.scValue];
        this.updateListOfSelectedValue(listOfSelectedValue, true);
      }
      if (this.isSingleMode) {
        this.setOpenState(false);
      } else if (this.autoClearSearchValue) {
        this.clearInput();
      }
    }
  }

  updateListOfCachedOption(): void {
    if (this.isSingleMode) {
      const selectedOption = this.listOfTemplateOption.find(o =>
        this.compareWith(o.scValue, this.listOfSelectedValue[0])
      );
      if (!isNil(selectedOption)) {
        this.listOfCachedSelectedOption = [selectedOption];
      }
    } else {
      const listOfCachedSelectedOption: ScOptionComponent[] = [];
      this.listOfSelectedValue.forEach(v => {
        const listOfMixedOption = [...this.listOfTagAndTemplateOption, ...this.listOfCachedSelectedOption];
        const option = listOfMixedOption.find(o => this.compareWith(o.scValue, v));
        if (option) {
          listOfCachedSelectedOption.push(option);
        }
      });
      this.listOfCachedSelectedOption = listOfCachedSelectedOption;
    }
  }

  updateListOfTagOption(): void {
    if (this.isTagsMode) {
      const listOfMissValue = this.listOfSelectedValue.filter(
        value => !this.listOfTemplateOption.find(o => this.compareWith(o.scValue, value))
      );
      this.listOfTagOption = listOfMissValue.map(value => {
        const cachedOption = this.listOfCachedSelectedOption.find(o => this.compareWith(o.scValue, value));
        if (cachedOption) {
          return cachedOption;
        } else {
          const scOptionComponent = new ScOptionComponent();
          scOptionComponent.scValue = value;
          scOptionComponent.scLabel = value;
          return scOptionComponent;
        }
      });
      this.listOfTagAndTemplateOption = [...this.listOfTemplateOption.concat(this.listOfTagOption)];
    } else {
      this.listOfTagAndTemplateOption = [...this.listOfTemplateOption];
    }
  }

  updateAddTagOption(): void {
    const isMatch = this.listOfTagAndTemplateOption.find(item => item.scLabel === this.searchValue);
    if (this.isTagsMode && this.searchValue && !isMatch) {
      const option = new ScOptionComponent();
      option.scValue = this.searchValue;
      option.scLabel = this.searchValue;
      this.addedTagOption = option;
      this.updateActivatedOption(option);
    } else {
      this.addedTagOption = null;
    }
  }

  updateListOfFilteredOption(): void {
    this.updateAddTagOption();
    const listOfFilteredOption = new ScFilterOptionPipe().transform(
      this.listOfTagAndTemplateOption,
      this.searchValue,
      this.filterOption,
      this.serverSearch
    );
    this.listOfFilteredOption = this.addedTagOption
      ? [this.addedTagOption, ...listOfFilteredOption]
      : [...listOfFilteredOption];
    this.isShowNotFound = !this.isTagsMode && !this.listOfFilteredOption.length;
  }

  clearInput(): void {
    this.clearInput$.next();
  }

  // tslint:disable-next-line:no-any
  updateListOfSelectedValue(value: any[], emit: boolean): void {
    this.listOfSelectedValueWithEmit$.next({ value, emit });
  }

  updateActivatedOption(option: ScOptionComponent | null): void {
    this.activatedOption$.next(option);
    this.activatedOption = option;
  }

  tokenSeparate(inputValue: string, tokenSeparators: string[]): void {
    // auto tokenSeparators
    if (
      inputValue &&
      inputValue.length &&
      tokenSeparators.length &&
      this.isMultipleOrTags &&
      this.includesSeparators(inputValue, tokenSeparators)
    ) {
      const listOfLabel = this.splitBySeparators(inputValue, tokenSeparators);
      this.updateSelectedValueByLabelList(listOfLabel);
      this.clearInput();
    }
  }

  includesSeparators(str: string | string[], separators: string[]): boolean {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < separators.length; ++i) {
      if (str.lastIndexOf(separators[i]) > 0) {
        return true;
      }
    }
    return false;
  }

  splitBySeparators(str: string | string[], separators: string[]): string[] {
    const reg = new RegExp(`[${separators.join()}]`);
    const array = (str as string).split(reg).filter(token => token);
    return Array.from(new Set(array));
  }

  resetActivatedOptionIfNeeded(): void {
    const resetActivatedOption = () => {
      const activatedOption = this.listOfFilteredOption.find(item =>
        this.compareWith(item.scValue, this.listOfSelectedValue[0])
      );
      this.updateActivatedOption(activatedOption || null);
    };
    if (this.activatedOption) {
      if (
        !this.listOfFilteredOption.find(item => this.compareWith(item.scValue, this.activatedOption!.scValue)) ||
        !this.listOfSelectedValue.find(item => this.compareWith(item, this.activatedOption!.scValue))
      ) {
        resetActivatedOption();
      }
    } else {
      resetActivatedOption();
    }
  }

  updateTemplateOption(
    listOfScOptionComponent: ScOptionComponent[],
    listOfScOptionGroupComponent: ScOptionGroupComponent[]
  ): void {
    this.mapOfTemplateOption$.next({ listOfScOptionComponent, listOfScOptionGroupComponent });
  }

  updateSearchValue(value: string): void {
    this.searchValueRaw$.next(value);
  }

  updateSelectedValueByLabelList(listOfLabel: string[]): void {
    const listOfSelectedValue = [...this.listOfSelectedValue];
    const listOfMatchOptionValue = this.listOfTagAndTemplateOption
      .filter(item => listOfLabel.indexOf(item.scLabel) !== -1)
      .map(item => item.scValue)
      .filter(item => !isNotNil(this.listOfSelectedValue.find(v => this.compareWith(v, item))));
    if (this.isMultipleMode) {
      this.updateListOfSelectedValue([...listOfSelectedValue, ...listOfMatchOptionValue], true);
    } else {
      const listOfUnMatchOptionValue = listOfLabel.filter(
        label => this.listOfTagAndTemplateOption.map(item => item.scLabel).indexOf(label) === -1
      );
      this.updateListOfSelectedValue(
        [...listOfSelectedValue, ...listOfMatchOptionValue, ...listOfUnMatchOptionValue],
        true
      );
    }
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const keyCode = e.keyCode;
    const eventTarget = e.target as HTMLInputElement;
    const listOfFilteredOptionWithoutDisabled = this.listOfFilteredOption.filter(item => !item.scDisabled);
    const activatedIndex = listOfFilteredOptionWithoutDisabled.findIndex(item => item === this.activatedOption);
    switch (keyCode) {
      case UP_ARROW:
        e.preventDefault();
        const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionWithoutDisabled.length - 1;
        this.updateActivatedOption(listOfFilteredOptionWithoutDisabled[preIndex]);
        break;
      case DOWN_ARROW:
        e.preventDefault();
        const nextIndex = activatedIndex < listOfFilteredOptionWithoutDisabled.length - 1 ? activatedIndex + 1 : 0;
        this.updateActivatedOption(listOfFilteredOptionWithoutDisabled[nextIndex]);
        if (!this.disabled && !this.open) {
          this.setOpenState(true);
        }
        break;
      case ENTER:
        e.preventDefault();
        if (this.open) {
          if (this.activatedOption && !this.activatedOption.scDisabled) {
            this.clickOption(this.activatedOption);
          }
        } else {
          this.setOpenState(true);
        }
        break;
      case BACKSPACE:
        if (this.isMultipleOrTags && !eventTarget.value && this.listOfCachedSelectedOption.length) {
          e.preventDefault();
          this.removeValueFormSelected(this.listOfCachedSelectedOption[this.listOfCachedSelectedOption.length - 1]);
        }
        break;
      case SPACE:
        if (!this.disabled && !this.open) {
          this.setOpenState(true);
          e.preventDefault();
        }
        break;
      case TAB:
        if (this.isMultipleOrTags && eventTarget.value && eventTarget.value !== ''
          && this._tokenSeparators && this._tokenSeparators.length > 0) {
          this.tokenSeparate(eventTarget.value + this._tokenSeparators[0], this._tokenSeparators);
          if (!this.open) {
            this.setOpenState(true);
          }
          e.preventDefault();
        } else {
          this.setOpenState(false);
        }
        break;
    }
  }

  // tslint:disable-next-line:no-any
  removeValueFormSelected(option: ScOptionComponent): void {
    if (this.disabled || option.scDisabled) {
      return;
    }
    const listOfSelectedValue = this.listOfSelectedValue.filter(item => !this.compareWith(item, option.scValue));
    this.updateListOfSelectedValue(listOfSelectedValue, true);
    this.clearInput();
  }

  setOpenState(value: boolean): void {
    this.openRaw$.next(value);
    this.open = value;
  }

  check(): void {
    this.checkRaw$.next();
  }

  get isSingleMode(): boolean {
    return this.mode === 'default';
  }

  get isTagsMode(): boolean {
    return this.mode === 'tags';
  }

  get isMultipleMode(): boolean {
    return this.mode === 'multiple';
  }

  get isMultipleOrTags(): boolean {
    return this.mode === 'tags' || this.mode === 'multiple';
  }

  set tokenSeparators(separators: string[]) {
    this._tokenSeparators = separators;
  }

  get tokenSeparators(): string[] {
    return this._tokenSeparators;
  }
}
