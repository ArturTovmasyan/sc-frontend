import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PaginationModule.forRoot(),
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PaginationModule,
    ]
})

export class SharedModule {
}
