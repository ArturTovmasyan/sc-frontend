import {Pipe, PipeTransform} from '@angular/core';
import {ActivityOwnerType} from '../models/activity';

@Pipe({name: 'activity_type'})
export class ActivityTypePipe implements PipeTransform {
  transform(value: ActivityOwnerType, route: boolean = false) {
    switch (value) {
      case ActivityOwnerType.LEAD:
        return route ? 'lead' : 'Lead';
      case  ActivityOwnerType.REFERRAL:
        return route ? 'referral' : 'Referral';
      case  ActivityOwnerType.ORGANIZATION:
        return route ? 'organization' : 'Organization';
      default:
        return value;
    }
  }
}
