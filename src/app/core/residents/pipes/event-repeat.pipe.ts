import {Pipe, PipeTransform} from '@angular/core';
import {RepeatType} from '../models/event-definition';

@Pipe({name: 'repeat_type'})
export class EventRepeatPipe implements PipeTransform {
  transform(value: RepeatType): string {
    switch (value) {
      case RepeatType.EVERY_DAY:
        return 'Every Day';
      case RepeatType.EVERY_WEEK:
        return 'Every Week';
      case RepeatType.EVERY_MONTH:
        return 'Every Month';
      default:
        return value;
    }
  }
}
