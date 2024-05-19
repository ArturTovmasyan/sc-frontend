import {Pipe, PipeTransform} from '@angular/core';
import {Resident} from '../models/resident';

@Pipe({name: 'resident_selector'})
export class ResidentSelectorPipe implements PipeTransform {
  transform(value: Resident) {
    if (value) {
      return (value.room_number ? value.room_number : '') +
        (value.bed_number && value.bed_number !== '' ? ' (' + value.bed_number + ') - ' : '') +
        (value.salutation ? (value.salutation + ' ') : '') +
        (value.first_name + ' ' + value.last_name);
    } else {
      return null;
    }
  }
}
