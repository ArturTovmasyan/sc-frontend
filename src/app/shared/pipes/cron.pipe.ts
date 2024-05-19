import cronstrue from 'cronstrue';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'cron'})
export class CronPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      return cronstrue.toString(value, { use24HourTimeFormat: true });
    } else {
      return null;
    }
  }
}
