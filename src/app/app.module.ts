import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { AppComponent } from './app.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgIdleModule } from '@ng-idle/core';
import {AppRoutingModule} from "./app-routing.module";

export function toastSettings() {
    const options = ToastDefaults;
    options.toast.iconClass = 'hidden';
    return options;
}

@NgModule({
  declarations: [
      AppComponent,
  ],
  imports: [
      AppRoutingModule,
      BrowserModule,
      SnotifyModule,
      NgHttpLoaderModule,
      NgIdleModule.forRoot(),
  ],
  providers: [
      {provide: 'SnotifyToastConfig', useValue: toastSettings()},
      SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
