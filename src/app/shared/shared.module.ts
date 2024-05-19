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
import {CronPipe} from './pipes/cron.pipe';
import {ScSelectModule} from './components/select/sc-select.module';
import {ModalFormComponent} from './components/modal/modal-form.component';
import {ButtonBarComponent} from './components/modal/button-bar.component';
import {FormComponent as MonthPickerFormComponent} from './components/month-picker-form/form.component';

@NgModule({
  declarations: [
    FieldErrorsComponent,
    FormErrorsComponent,
    InputCounterComponent,
    MessageComponent,
    ModalFormComponent,
    ButtonBarComponent,
    MonthPickerFormComponent,

    CronPipe,
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
    NgZorroAntdModule,
    ScSelectModule
  ],
  entryComponents: [
    MessageComponent,
    MonthPickerFormComponent,
    ModalFormComponent
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
    ScSelectModule,

    FieldErrorsComponent,
    FormErrorsComponent,
    InputCounterComponent,
    ModalFormComponent,
    ButtonBarComponent,
    MonthPickerFormComponent,

    CronPipe,
    KeysPipe,
    FilterPipe,
    String2JsonPipe,
    StringPipe
  ]
})

export class SharedModule {
}
