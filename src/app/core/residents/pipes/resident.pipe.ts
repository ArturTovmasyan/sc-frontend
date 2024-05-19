import {Pipe, PipeTransform} from '@angular/core';
import {Resident} from '../models/resident';

@Pipe({name: 'resident'})
export class ResidentPipe implements PipeTransform {
  transform(value: Resident) {
    if (value) {
      return (value.salutation ? ((value.salutation.title ? value.salutation.title : value.salutation) + ' ') : '')
        + value.first_name + ' ' + (value.middle_name ? value.middle_name + ' ' : '') + value.last_name;
    } else {
      return null;
    }
  }
}
