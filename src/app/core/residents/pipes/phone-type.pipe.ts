import {Pipe, PipeTransform} from '@angular/core';
import {PhoneType} from '../models/phone-type.enum';

@Pipe({name: 'phone_type'})
export class PhoneTypePipe implements PipeTransform {
  transform(value: PhoneType): string {
    switch (value) {
      case PhoneType.HOME:
        return 'Home';
      case PhoneType.MOBILE:
        return 'Mobile';
      case PhoneType.WORK:
        return 'Work';
      case PhoneType.OFFICE:
        return 'Office';
      case PhoneType.EMERGENCY:
        return 'Emergency';
      case PhoneType.FAX:
        return 'Fax';
      case PhoneType.ROOM:
        return 'Room';
      default:
        return value;
    }
  }
}
