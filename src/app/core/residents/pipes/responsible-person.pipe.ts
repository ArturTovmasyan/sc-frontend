import {Pipe, PipeTransform} from '@angular/core';
import {ResponsiblePerson} from '../models/responsible-person';

@Pipe({name: 'responsible_person'})
export class ResponsiblePersonPipe implements PipeTransform {
  transform(value: ResponsiblePerson) {
    if (value) {
      return (value.salutation && value.salutation.title ? (value.salutation.title + ' ') : '') + value.first_name + ' ' + value.last_name;
    } else {
      return null;
    }
  }
}
