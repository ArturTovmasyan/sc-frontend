import {Pipe, PipeTransform} from '@angular/core';
import {Resident} from '../models/resident';

@Pipe({name: 'resident'})
export class ResidentPipe implements PipeTransform {
  transform(value: Resident) {
    return (value.salutation ? (value.salutation.title + ', ') : '') + value.first_name + ' ' + value.last_name;
  }
}
