import {Pipe, PipeTransform} from '@angular/core';
import {ChangeLogType} from '../models/change-log-type.enum';

@Pipe({name: 'change_log'})
export class ChangeLogPipe implements PipeTransform {
  transform(value: ChangeLogType): string {
    switch (value) {
      case ChangeLogType.NEW_LEAD:
        return 'New Lead';
      case ChangeLogType.LEAD_UPDATED:
        return 'Lead State Changed';
      case ChangeLogType.NEW_TASK:
        return 'New Activity To Do';
      case ChangeLogType.TASK_UPDATED:
        return 'Modified Activity To Do Status';
      default:
        return value;
    }
  }
}
