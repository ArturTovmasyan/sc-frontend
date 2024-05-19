import {Pipe, PipeTransform} from '@angular/core';
import {Lead} from '../../leads/models/lead';

@Pipe({name: 'lead'})
export class LeadPipe implements PipeTransform {
  transform(value: Lead) {
    if (value) {
      return value.first_name + ' ' + value.last_name;
    } else {
      return null;
    }
  }
}
