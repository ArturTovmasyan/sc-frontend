import {Pipe, PipeTransform} from '@angular/core';
import {Contact} from '../../leads/models/contact';

@Pipe({name: 'lead_contact'})
export class LeadContactPipe implements PipeTransform {
  transform(value: Contact) {
    if (value) {
      return value.first_name + ' ' + value.last_name;
    } else {
      return null;
    }
  }
}
