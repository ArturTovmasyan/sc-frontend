import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {TranslateModule} from '@ngx-translate/core';
import {FormErrorsComponent} from './components/abstract-form/form-errors/form-errors.component';
import {FieldErrorsComponent} from './components/abstract-form/form-errors/field-errors.component';
import {InputCounterComponent} from './components/input-counter/input-counter.component';
import {MessageComponent} from './components/grid/message.component';

import {FilterPipe} from './pipes/filter.pipe';
import {KeysPipe} from './pipes/keys.pipe';
import {String2JsonPipe} from './pipes/str2json.pipe';
import {StringPipe} from './pipes/string.pipe';

@NgModule({
  declarations: [
    FieldErrorsComponent,
    FormErrorsComponent,
    InputCounterComponent,
    MessageComponent,

    FilterPipe,
    KeysPipe,
    String2JsonPipe,
    StringPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    NgZorroAntdModule
  ],
  entryComponents: [
    MessageComponent
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US}
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    NgZorroAntdModule,

    FieldErrorsComponent,
    FormErrorsComponent,
    InputCounterComponent,

    KeysPipe,
    FilterPipe,
    String2JsonPipe,
    StringPipe
  ]
})

export class SharedModule {
}
