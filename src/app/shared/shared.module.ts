import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {FormErrorsComponent} from './components/abstract-form/form-errors/form-errors.component';
import {FieldErrorsComponent} from './components/abstract-form/form-errors/field-errors.component';
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import {TranslateModule} from '@ngx-translate/core';
import {StringPipe} from './pipes/string.pipe';
import {String2JsonPipe} from './pipes/str2json.pipe';
import {MessageComponent} from './components/grid/message.component';
import {InputCounterComponent} from './components/input-counter/input-counter.component';

@NgModule({
  declarations: [
    FieldErrorsComponent,
    FormErrorsComponent,
    MessageComponent,
    InputCounterComponent,
    StringPipe,
    String2JsonPipe
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
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FieldErrorsComponent,
    FormErrorsComponent,
    InputCounterComponent,
    StringPipe,
    String2JsonPipe
  ]
})

export class SharedModule {
}
