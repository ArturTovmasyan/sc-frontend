import {BehaviorSubject} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TitleService {
  title: BehaviorSubject<string>;

  constructor(browserTitle$: Title) {
    this.title = new BehaviorSubject<string>(browserTitle$.getTitle());

    this.title.subscribe(v => browserTitle$.setTitle(v));
  }

  getTitleValue(): string {
    return this.title.getValue();
  }

  getTitle(): BehaviorSubject<string> {
    return this.title;
  }

  setTitle(title: string): void {
    this.title.next(title);
  }
}
